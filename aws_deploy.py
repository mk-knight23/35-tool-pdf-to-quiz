import os
import subprocess
import sys

def run():
    app_id = "dninv9f0c6xnp"
    branch_name = "main"
    job_id = "3"
    upload_url = sys.argv[1]

    print("Zipping dist...")
    subprocess.run(["zip", "-r", "build.zip", "dist"], check=True)

    print("Uploading to S3...")
    subprocess.run(["curl", "-X", "PUT", "-T", "build.zip", upload_url], check=True)

    print("Starting deployment...")
    subprocess.run(["aws", "amplify", "start-deployment", "--app-id", app_id, "--branch-name", branch_name, "--job-id", job_id], check=True)

if __name__ == "__main__":
    run()
