## 🛡️ Security Considerations
### 🔒 Never Hardcode Sensitive Information
- Absolutely **never** commit API keys, credentials, or other secrets directly in the code.
- Use environment variables or `Script Properties` for sensitive configurations.
- Document secret handling clearly in the README if needed.

---

## 🛠️ Development Workflow & Best Practices - MANDATORY

### 🐳 Use Docker for All Development
- **MANDATORY**: All development and testing **must** be done inside Docker containers.
- A consistent, reproducible environment is critical — avoid running scripts or servers directly on your local OS.
- If new dependencies are introduced, update the `Dockerfile` and rebuild the image.
- Always validate changes inside the Docker container using `docker-compose` or `make` targets.

---

### 🧪 Code Change & Testing Policy - MANDATORY
- **Every code change requires testing**. No exceptions.
- Add or update test cases if you:
  - Add new logic or features
  - Refactor any existing functions
  - Change external integrations or configurations
- Use test scripts, assertions, or logging inside Docker to validate behavior.
- Always check logs and outputs **after** running tests.

---

### 📄 README Update Policy - ALWAYS REQUIRED
**MANDATORY**: Update `README.md` with every meaningful code change:

1. ➕ New Features: Describe and provide usage examples
2. ⚙️ Config Changes: Update instructions and variable descriptions
3. 📁 Folder Structure: Reflect any structural updates
4. 🔁 Function Signatures: Sync documentation with code
5. ✅ Before Committing: Ensure `README.md` reflects current behavior

---

### 🌿 Git Branch Management - MANDATORY
- **Create a new branch for every code change**.
- Ensure the latest remote state before branching.
- Use clear naming conventions (e.g., `feature/add-docker`, `fix/typo-readme`).

---

### ⚠️ NEVER Do - Strict Prohibitions
- ❌ Edit the `main` branch directly
- ❌ Push untested code
- ❌ Commit without updating the README
- ❌ Hardcode sensitive information
- ❌ Mix multiple unrelated changes in one commit
- ❌ Bypass Docker workflows

---

### ✅ ALWAYS Do - Mandatory Requirements
- ✅ Use Docker for all development and testing
- ✅ Create feature branches for all changes
- ✅ Update `README.md` consistently
- ✅ Write and run tests for every code change
- ✅ Use clear, descriptive commit messages
- ✅ Store all secrets in environment files or secure stores
- ✅ Include security & deployment notes in documentation

---

