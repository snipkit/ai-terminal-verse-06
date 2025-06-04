
use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct WorkflowArgument {
    pub name: String,
    pub description: Option<String>,
    pub default_value: Option<String>,
    pub required: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Workflow {
    pub name: String,
    pub command: String,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
    pub arguments: Option<Vec<WorkflowArgument>>,
    pub source_url: Option<String>,
    pub author: Option<String>,
    pub author_url: Option<String>,
    pub shells: Option<Vec<String>>,
    pub slug: String,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct SearchIndexEntry {
    pub slug: String,
    pub name: String,
    pub description: String,
    pub tags: Vec<String>,
    pub command: String,
    pub author: Option<String>,
    pub searchable_text: String,
}

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct WorkflowCollection {
    pub workflows: Vec<Workflow>,
    pub search_index: Vec<SearchIndexEntry>,
    pub tags: Vec<String>,
}

impl Workflow {
    pub fn to_search_entry(&self) -> SearchIndexEntry {
        let tags = self.tags.clone().unwrap_or_default();
        let description = self.description.clone().unwrap_or_default();
        
        let searchable_text = format!(
            "{} {} {} {} {}",
            self.name,
            description,
            tags.join(" "),
            self.command,
            self.author.clone().unwrap_or_default()
        ).to_lowercase();

        SearchIndexEntry {
            slug: self.slug.clone(),
            name: self.name.clone(),
            description,
            tags,
            command: self.command.clone(),
            author: self.author.clone(),
            searchable_text,
        }
    }
}
