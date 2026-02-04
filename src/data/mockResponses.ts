import { PlannerOutput, ExecutorOutput, CriticOutput, RefinementOutput } from '@/types/agent';

export const EXAMPLE_GOALS = {
  internship: "Analyze if this internship posting is fake or legitimate",
  fibonacci: "Write code to find the Fibonacci sequence of a given number"
};

// Internship Verification Mock Data
export const internshipPlannerOutput: PlannerOutput = {
  reasoning: "Breaking down the internship verification task into systematic analysis steps to ensure comprehensive evaluation.",
  subTasks: [
    { id: 1, title: "Extract key details from posting (company, role, requirements)", status: 'pending' },
    { id: 2, title: "Analyze red flags (unrealistic pay, vague descriptions, upfront fees)", status: 'pending' },
    { id: 3, title: "Cross-reference company information", status: 'pending' },
    { id: 4, title: "Generate verification score and report", status: 'pending' }
  ]
};

export const internshipExecutorOutputs: ExecutorOutput[] = [
  {
    taskId: 1,
    type: 'analysis',
    result: `**Extracted Details:**
- Company: TechStartup Solutions Inc.
- Role: Software Development Intern
- Duration: 3 months
- Compensation: $5,000/month (remote)
- Requirements: "No experience needed, just enthusiasm!"
- Contact: Gmail address (techstartup.hr@gmail.com)`
  },
  {
    taskId: 2,
    type: 'analysis',
    result: `**Red Flags Identified:**
🚩 Unusually high pay ($5,000/month) for an internship requiring no experience
🚩 Generic Gmail address instead of company domain
🚩 Vague job requirements with no specific skills mentioned
🚩 No company website or LinkedIn presence mentioned
⚠️ "Remote-only" with immediate start date`
  },
  {
    taskId: 3,
    type: 'analysis',
    result: `**Company Verification Results:**
- LinkedIn: No official company page found
- Website: Domain not registered
- Business Registry: No matching registration found
- Glassdoor: Zero reviews or mentions
- Google Search: No credible results`
  },
  {
    taskId: 4,
    type: 'analysis',
    result: `**Initial Verification Score: 25/100 (High Risk)**

Preliminary Assessment: LIKELY FAKE

The posting exhibits multiple characteristics commonly associated with fraudulent internship offers.`
  }
];

export const internshipCriticOutput: CriticOutput = {
  overallScore: 65,
  critiques: [
    { id: 1, issue: "Analysis lacks salary comparison data", severity: 'warning', suggestion: "Add industry-standard salary benchmarks for comparison" },
    { id: 2, issue: "Missing verification of company registration details", severity: 'critical', suggestion: "Include specific database sources checked" },
    { id: 3, issue: "Red flag analysis is thorough", severity: 'pass', suggestion: "Good coverage of common scam indicators" },
    { id: 4, issue: "No mention of potential legitimate explanations", severity: 'warning', suggestion: "Consider edge cases where legitimate startups may exhibit similar traits" }
  ]
};

export const internshipRefinementOutput: RefinementOutput = {
  original: "Initial Verification Score: 25/100 (High Risk)\n\nPreliminary Assessment: LIKELY FAKE",
  refined: `# 🔍 Internship Verification Report

## Final Verdict: ⛔ LIKELY FAKE (Confidence: 92%)

### Verification Score: 18/100 (Critical Risk)

---

### 📊 Salary Benchmark Analysis
| Position | Industry Average | Posted Offer |
|----------|-----------------|--------------|
| Software Intern (Entry) | $1,500-2,500/mo | $5,000/mo |
| **Deviation** | — | **+100-233%** |

---

### 🏢 Company Verification Matrix
| Source | Status | Details |
|--------|--------|---------|
| SEC EDGAR | ❌ Not Found | No filings |
| State Business Registry | ❌ Not Found | Checked: DE, CA, NY |
| D&B Database | ❌ Not Found | No business record |
| LinkedIn | ❌ Not Found | No company page |

---

### ⚠️ Critical Red Flags
1. **Financial Anomaly**: Pay 100-233% above market rate
2. **Identity Issues**: Gmail contact, no company domain
3. **Verification Failure**: Zero presence in business databases
4. **Classic Scam Pattern**: "No experience needed" + high pay

---

### 💡 Recommendation
**DO NOT PROCEED** with this opportunity. Report to relevant job platform.`,
  improvements: [
    "Added quantitative salary benchmark comparison table",
    "Included specific database sources with verification status",
    "Created structured verification matrix for company checks",
    "Added confidence percentage to final verdict",
    "Included actionable recommendation"
  ]
};

// Fibonacci Code Generator Mock Data
export const fibonacciPlannerOutput: PlannerOutput = {
  reasoning: "Implementing a Fibonacci solution requires careful consideration of efficiency, edge cases, and code clarity.",
  subTasks: [
    { id: 1, title: "Define problem requirements and constraints", status: 'pending' },
    { id: 2, title: "Choose optimal algorithm approach", status: 'pending' },
    { id: 3, title: "Implement solution with proper documentation", status: 'pending' },
    { id: 4, title: "Add input validation and error handling", status: 'pending' }
  ]
};

export const fibonacciExecutorOutputs: ExecutorOutput[] = [
  {
    taskId: 1,
    type: 'text',
    result: `**Problem Requirements:**
- Input: A positive integer n
- Output: The nth Fibonacci number OR the sequence up to n
- Constraints: Handle n = 0, 1 as base cases
- Performance: Should handle reasonably large values of n`
  },
  {
    taskId: 2,
    type: 'text',
    result: `**Algorithm Analysis:**

| Approach | Time Complexity | Space Complexity | Pros |
|----------|----------------|------------------|------|
| Recursive | O(2^n) | O(n) | Simple |
| Iterative | O(n) | O(1) | Efficient |
| Memoization | O(n) | O(n) | Fast repeated calls |

**Selected: Iterative approach** for optimal performance with O(n) time and O(1) space.`
  },
  {
    taskId: 3,
    type: 'code',
    result: `function fibonacci(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  
  return curr;
}

// Get sequence up to n
function fibonacciSequence(n) {
  const sequence = [];
  for (let i = 0; i <= n; i++) {
    sequence.push(fibonacci(i));
  }
  return sequence;
}

// Example usage
console.log(fibonacci(10)); // 55
console.log(fibonacciSequence(10)); // [0,1,1,2,3,5,8,13,21,34,55]`
  },
  {
    taskId: 4,
    type: 'code',
    result: `function fibonacci(n) {
  // Basic validation
  if (typeof n !== 'number') {
    throw new Error('Input must be a number');
  }
  
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`
  }
];

export const fibonacciCriticOutput: CriticOutput = {
  overallScore: 70,
  critiques: [
    { id: 1, issue: "Missing edge case handling for negative numbers", severity: 'critical', suggestion: "Add validation to reject or handle negative inputs" },
    { id: 2, issue: "Could optimize with memoization for repeated calls", severity: 'warning', suggestion: "Add caching for better performance in repeated use" },
    { id: 3, issue: "Good algorithm choice with O(n) complexity", severity: 'pass', suggestion: "Iterative approach is efficient" },
    { id: 4, issue: "No TypeScript types provided", severity: 'warning', suggestion: "Add TypeScript annotations for better code quality" }
  ]
};

export const fibonacciRefinementOutput: RefinementOutput = {
  original: `function fibonacci(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
  refined: `/**
 * Calculates the nth Fibonacci number using an optimized iterative approach
 * with memoization for repeated calls.
 * 
 * Time Complexity: O(n) for first call, O(1) for cached values
 * Space Complexity: O(n) for cache
 * 
 * @param n - The position in Fibonacci sequence (0-indexed)
 * @returns The nth Fibonacci number
 * @throws Error if input is invalid
 * 
 * @example
 * fibonacci(0)  // Returns: 0
 * fibonacci(1)  // Returns: 1
 * fibonacci(10) // Returns: 55
 */

// Memoization cache for optimization
const fibCache: Map<number, number> = new Map();

function fibonacci(n: number): number {
  // Input validation
  if (typeof n !== 'number' || !Number.isInteger(n)) {
    throw new Error('Input must be an integer');
  }
  
  if (n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  if (n > 1000) {
    throw new Error('Input too large. Maximum supported value is 1000');
  }
  
  // Check cache first
  if (fibCache.has(n)) {
    return fibCache.get(n)!;
  }
  
  // Base cases
  if (n <= 1) {
    fibCache.set(n, n);
    return n;
  }
  
  // Iterative calculation
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
    fibCache.set(i, curr); // Cache intermediate values
  }
  
  return curr;
}

/**
 * Returns the Fibonacci sequence from 0 to n
 * @param n - The last position in the sequence
 * @returns Array of Fibonacci numbers
 */
function fibonacciSequence(n: number): number[] {
  if (n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  return Array.from({ length: n + 1 }, (_, i) => fibonacci(i));
}

// Example usage:
// fibonacci(10)         → 55
// fibonacciSequence(10) → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

export { fibonacci, fibonacciSequence };`,
  improvements: [
    "Added TypeScript type annotations",
    "Implemented memoization cache for O(1) repeated calls",
    "Added comprehensive input validation (negative, non-integer, too large)",
    "Added JSDoc documentation with examples",
    "Included complexity analysis in comments",
    "Added maximum input limit to prevent overflow"
  ]
};
