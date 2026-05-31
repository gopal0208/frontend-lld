# 🌐 Frontend Low-Level Design (LLD) Learning Hub

An interactive learning platform designed to help developers master **Low-Level Design (LLD)** concepts, design patterns, and engineering challenges in frontend development. Built using **React, TypeScript, CSS**, and styled with a cyberpunk dark glassmorphism aesthetic.

🔗 **Live Portal:** [gopal0208.github.io/frontend-lld](https://gopal0208.github.io/frontend-lld/)

---

## 🚀 Key Features

### 1. 🧩 Design Patterns Catalogue
Isolated, single-responsibility explanations of core structural and behavioral design patterns:
* **Singleton**: Single instances like global stores or notification queues.
* **Observer**: Reactive communication between objects.
* **Pub-Sub**: Loose-coupled message brokers.
* Features includes UML ASCII block diagrams, design intent, when-to-use lists, advantages/disadvantages, and dynamic code playgrounds.

### 2. 🎮 Interactive Design Challenges
Real-world widget simulations showing design patterns in production code:
* **Autocomplete (Typeahead) Search**: Demonstrates debouncing, caching, and `AbortController` cancellation.
* **Toast Notification Manager**: Demonstrates Singleton queues, Observer patterns, and UI transitions.
* **Recursive Comments Thread**: Nested states and operations at arbitrary depth.
* **Drag-and-Drop Kanban Board**: Custom HTML5 drag & drop implementation with column state transfers.
* **File Explorer Directory**: Interactive folder tree structures (CRUD operations).
---

## 🛠️ Tech Stack & Directory Structure

```text
├── .github/workflows/   # Automatic GitHub Pages CI/CD Actions
├── public/
│   ├── lld_database.json # Dynamic database catalog shell (JSON)
├── src/
│   ├── components/      # Core visual elements (Sidebar, CreatorStudio, VideoPlayer)
│   ├── concepts/        # Sub-widgets for interactive challenges
│   ├── patterns/        # Files for design patterns
│   └── styles/          # HSL design tokens, global resets, main glassmorphism
```

* **Core**: React 19, TypeScript, Vite.
* **Styling**: Pure CSS (Variable design tokens, grid & flex layouts).
* **Icons**: Lucide Icons.

---

## 📦 Getting Started

### Prerequisites
* **Node.js** (v20+ recommended)
* **NPM** (v10+ recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/gopal0208/frontend-lld.git
   cd frontend-lld
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server locally:
   ```bash
   npm run dev
   ```
4. Build the production bundle:
   ```bash
   npm run build
   ```

---

## 📄 License
This project is open-source and available under the MIT License.
