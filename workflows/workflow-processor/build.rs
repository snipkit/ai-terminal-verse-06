
use anyhow::Result;
use convert_case::{Case, Casing};
use serde_json;
use std::collections::{HashMap, HashSet};
use std::ffi::OsStr;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use workflow_processor::{Workflow, WorkflowArgument, WorkflowCollection};

fn main() -> Result<()> {
    println!("cargo:rerun-if-changed=../specs");

    let specs_dir = "../specs";
    let output_dir = "generated";
    
    // Create output directory
    fs::create_dir_all(&output_dir)?;
    
    let mut workflows = Vec::new();
    let mut all_tags = HashSet::new();

    // Process all YAML files
    for entry in WalkDir::new(specs_dir) {
        let entry = entry?;
        let path = entry.path();
        
        if let Some(extension) = path.extension().and_then(OsStr::to_str) {
            if extension == "yaml" || extension == "yml" {
                println!("Processing: {:?}", path);
                
                let content = fs::read_to_string(path)?;
                let mut workflow: serde_yaml::Value = serde_yaml::from_str(&content)?;
                
                // Generate slug from filename
                let filename = path.file_stem()
                    .and_then(OsStr::to_str)
                    .unwrap_or("unknown")
                    .to_case(Case::Kebab);
                
                // Convert to our Workflow struct
                let name = workflow.get("name")
                    .and_then(|v| v.as_str())
                    .unwrap_or(&filename)
                    .to_string();
                
                let command = workflow.get("command")
                    .and_then(|v| v.as_str())
                    .unwrap_or("")
                    .to_string();
                
                let description = workflow.get("description")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                
                let tags = workflow.get("tags")
                    .and_then(|v| v.as_sequence())
                    .map(|seq| {
                        seq.iter()
                            .filter_map(|v| v.as_str())
                            .map(|s| s.to_string())
                            .collect::<Vec<_>>()
                    });
                
                if let Some(ref tag_list) = tags {
                    for tag in tag_list {
                        all_tags.insert(tag.clone());
                    }
                }
                
                let arguments = workflow.get("arguments")
                    .and_then(|v| v.as_sequence())
                    .map(|seq| {
                        seq.iter()
                            .filter_map(|v| v.as_mapping())
                            .map(|mapping| {
                                let name = mapping.get(&serde_yaml::Value::String("name".to_string()))
                                    .and_then(|v| v.as_str())
                                    .unwrap_or("")
                                    .to_string();
                                
                                let description = mapping.get(&serde_yaml::Value::String("description".to_string()))
                                    .and_then(|v| v.as_str())
                                    .map(|s| s.to_string());
                                
                                let default_value = mapping.get(&serde_yaml::Value::String("default_value".to_string()))
                                    .and_then(|v| v.as_str())
                                    .map(|s| s.to_string());
                                
                                WorkflowArgument {
                                    name,
                                    description,
                                    default_value,
                                    required: Some(true),
                                }
                            })
                            .collect::<Vec<_>>()
                    });
                
                let source_url = workflow.get("source_url")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                
                let author = workflow.get("author")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                
                let author_url = workflow.get("author_url")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string());
                
                let shells = workflow.get("shells")
                    .and_then(|v| v.as_sequence())
                    .map(|seq| {
                        seq.iter()
                            .filter_map(|v| v.as_str())
                            .map(|s| s.to_string())
                            .collect::<Vec<_>>()
                    });
                
                let workflow_struct = Workflow {
                    name,
                    command,
                    description,
                    tags,
                    arguments,
                    source_url,
                    author,
                    author_url,
                    shells,
                    slug: filename,
                };
                
                workflows.push(workflow_struct);
            }
        }
    }
    
    // Create search index
    let search_index: Vec<_> = workflows.iter()
        .map(|w| w.to_search_entry())
        .collect();
    
    let tags: Vec<String> = all_tags.into_iter().collect();
    
    let collection = WorkflowCollection {
        workflows: workflows.clone(),
        search_index,
        tags,
    };
    
    // Generate workflows.ts
    let workflows_ts = format!(
        r#"// Auto-generated by workflow-processor
import {{ Workflow, SearchIndexEntry, WorkflowCollection }} from './types';

export const WORKFLOWS: Workflow[] = {};

export const SEARCH_INDEX: SearchIndexEntry[] = {};

export const WORKFLOW_TAGS: string[] = {};

export const WORKFLOW_COLLECTION: WorkflowCollection = {};

export function getWorkflowBySlug(slug: string): Workflow | undefined {{
  return WORKFLOWS.find(w => w.slug === slug);
}}

export function getWorkflowsByTag(tag: string): Workflow[] {{
  return WORKFLOWS.filter(w => w.tags?.includes(tag) ?? false);
}}

export function searchWorkflows(query: string): Workflow[] {{
  const lowerQuery = query.toLowerCase();
  const matches = SEARCH_INDEX.filter(entry => 
    entry.searchable_text.includes(lowerQuery)
  );
  
  return matches.map(match => 
    WORKFLOWS.find(w => w.slug === match.slug)
  ).filter(Boolean) as Workflow[];
}}
"#,
        serde_json::to_string_pretty(&workflows)?,
        serde_json::to_string_pretty(&collection.search_index)?,
        serde_json::to_string_pretty(&collection.tags)?,
        serde_json::to_string_pretty(&collection)?
    );
    
    fs::write(format!("{}/workflows.ts", output_dir), workflows_ts)?;
    
    // Generate TypeScript types
    let types_content = format!(
        r#"// Auto-generated TypeScript types
{}

{}

{}

{}
"#,
        workflow_processor::WorkflowArgument::decl(),
        workflow_processor::Workflow::decl(),
        workflow_processor::SearchIndexEntry::decl(),
        workflow_processor::WorkflowCollection::decl()
    );
    
    fs::write(format!("{}/types.ts", output_dir), types_content)?;
    
    // Generate search index JSON for client-side use
    fs::write(
        format!("{}/search-index.json", output_dir),
        serde_json::to_string_pretty(&collection.search_index)?
    )?;
    
    println!("Generated {} workflows", workflows.len());
    println!("Generated {} unique tags", collection.tags.len());
    
    Ok(())
}
