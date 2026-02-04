

# Autonomous Agentic AI System Prototype

A dashboard-style prototype demonstrating the **Planner-Executor-Critic** architecture with step-by-step visualization and two example use cases.

---

## 🎯 Core Features

### 1. Goal Input Interface
- Clean input area where users can enter high-level goals
- Pre-loaded example buttons for quick demos:
  - "Analyze if this internship posting is fake or legitimate"
  - "Write code to find the Fibonacci sequence of a given number"
- Submit button to trigger the autonomous agent

### 2. Agent Dashboard (Main View)
A multi-panel layout showing:
- **Goal Panel** - Displays the current goal being processed
- **Agent Status** - Shows current phase (Planning → Executing → Critiquing → Refining)
- **Task Breakdown Panel** - Expandable cards showing decomposed sub-tasks
- **Memory Panel** - Shows goals, plans, and results from current session

### 3. Step-by-Step Agent Visualization

Each phase displayed as expandable cards:

**Planner Module Card**
- Shows the goal decomposition into numbered sub-tasks
- Visual indicator showing task dependencies/order

**Executor Module Card**
- Displays execution results for each sub-task
- Shows outputs like analysis results or generated code

**Critic Module Card**
- Displays feedback/issues identified in the outputs
- Severity indicators (pass, needs improvement, critical)

**Refinement Card**
- Shows the improved/refined output after critique
- Before/after comparison where applicable

---

## 📋 Example 1: Internship Verification

When user submits: *"Analyze if this internship posting is fake or legitimate"*

**Planner Output:**
1. Extract key details from posting (company, role, requirements)
2. Analyze red flags (unrealistic pay, vague descriptions, upfront fees)
3. Cross-reference company information
4. Generate verification score and report

**Executor Output:**
- Analysis of the provided internship details
- List of identified red flags or trust signals

**Critic Output:**
- "Analysis lacks salary comparison data"
- "Missing verification of company registration"

**Refined Output:**
- Enhanced report with additional verification points
- Clear "Likely Fake" or "Appears Legitimate" verdict with reasoning

---

## 📋 Example 2: Fibonacci Code Generator

When user submits: *"Write code to find the Fibonacci sequence of a given number"*

**Planner Output:**
1. Define problem requirements and constraints
2. Choose optimal algorithm approach
3. Implement solution with proper documentation
4. Add input validation and error handling

**Executor Output:**
- Initial JavaScript/Python code implementation
- Basic Fibonacci function

**Critic Output:**
- "Missing edge case handling for negative numbers"
- "Could optimize with memoization for larger inputs"

**Refined Output:**
- Optimized code with memoization
- Input validation added
- Code comments and documentation included

---

## 🎨 Design & Layout

**Dashboard Layout:**
- Left sidebar with navigation (Home, Examples, Memory Log)
- Main content area with the agent visualization
- Right panel showing session memory/history

**Visual Elements:**
- Progress indicator showing current agent phase
- Color-coded status badges (Planning = Blue, Executing = Yellow, Critiquing = Orange, Complete = Green)
- Expandable/collapsible cards for each module
- Code blocks with syntax highlighting for generated code

---

## 🔧 Technical Approach

- **Session memory** stored in React state (resets on page refresh)
- **Mock/simulated responses** - Pre-defined realistic outputs for both examples
- **Animated transitions** between agent phases for visual feedback
- **Responsive design** - Works on desktop and tablet

