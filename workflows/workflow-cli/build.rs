
use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=src/");
    println!("cargo:rerun-if-changed=Cargo.toml");

    // Get build information
    let target = env::var("TARGET").unwrap_or_else(|_| "unknown".to_string());
    let profile = env::var("PROFILE").unwrap_or_else(|_| "debug".to_string());
    
    println!("cargo:rustc-env=BUILD_TARGET={}", target);
    println!("cargo:rustc-env=BUILD_PROFILE={}", profile);

    // Get git information if available
    if let Ok(output) = Command::new("git")
        .args(&["rev-parse", "--short", "HEAD"])
        .output()
    {
        if output.status.success() {
            let git_hash = String::from_utf8_lossy(&output.stdout).trim().to_string();
            println!("cargo:rustc-env=GIT_HASH={}", git_hash);
        }
    }

    // Create build info file
    let out_dir = env::var("OUT_DIR").unwrap();
    let build_info_path = Path::new(&out_dir).join("build_info.txt");
    
    let build_info = format!(
        "Target: {}\nProfile: {}\nBuilt at: {}\n",
        target,
        profile,
        chrono::Utc::now().format("%Y-%m-%d %H:%M:%S UTC")
    );
    
    if let Err(e) = fs::write(&build_info_path, build_info) {
        eprintln!("Warning: Could not write build info: {}", e);
    }
}
