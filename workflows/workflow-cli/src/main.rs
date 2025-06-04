
use anyhow::Result;
use clap::{Parser, Subcommand};
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "workflow")]
#[command(about = "A CLI tool for managing workflows")]
#[command(version = "0.1.0")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// List all available workflows
    List {
        /// Filter by tag
        #[arg(short, long)]
        tag: Option<String>,
    },
    /// Run a workflow by name
    Run {
        /// Workflow name
        name: String,
        /// Arguments as key=value pairs
        #[arg(short, long)]
        args: Vec<String>,
    },
    /// Create a new workflow
    Create {
        /// Output file path
        #[arg(short, long)]
        output: PathBuf,
    },
    /// Validate workflow files
    Validate {
        /// Directory containing workflow YAML files
        #[arg(short, long, default_value = "specs")]
        dir: PathBuf,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::List { tag } => {
            println!("Listing workflows...");
            if let Some(tag) = tag {
                println!("Filtered by tag: {}", tag);
            }
        }
        Commands::Run { name, args } => {
            println!("Running workflow: {}", name);
            for arg in args {
                println!("  Argument: {}", arg);
            }
        }
        Commands::Create { output } => {
            println!("Creating workflow at: {:?}", output);
        }
        Commands::Validate { dir } => {
            println!("Validating workflows in: {:?}", dir);
        }
    }

    Ok(())
}
