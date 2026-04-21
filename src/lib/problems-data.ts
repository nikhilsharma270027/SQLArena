// lib/problems-data.ts
export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  likes: number;
  submissions: number;
  examples?: { input: string; output: string }[];
  constraints?: string;
  starterQuery?: string;
};


export const problems: Problem[] = [
  {
    id: "1",
    title: "Employees with Salary > 50000",
    description: "Write a query to find all employees whose salary is greater than 50000. Return their name, department, and salary.",
    difficulty: "Easy",
    points: 10,
    likes: 45,
    submissions: 120,
    examples: [
      { input: "Table employees", output: "John, Sales, 60000" },
    ],
    starterQuery: "SELECT name, department, salary FROM employees WHERE salary > 50000;",
  },
  {
    id: "2",
    title: "Top 3 Highest Paid Employees",
    description: "Write a query to find the top 3 highest paid employees. Return their name, department, and salary.",
    difficulty: "Medium", 
    points: 15,
    likes: 32,
    submissions: 80,
    examples: [
      { input: "Table employees", output: "Alice, Engineering, 120000" },
    ],
    starterQuery: "SELECT name, department, salary FROM employees ORDER BY salary DESC LIMIT 3;",
  },
  {
    id: "3",
    title: "Average Salary by Department",
    description: "Write a query to calculate the average salary for each department. Return the department name and average salary.", 
    difficulty: "Medium",
    points: 15,
    likes: 28,  
    submissions: 90,
    examples: [
      { input: "Table employees", output: "Sales, 55000" },
    ],
    starterQuery: "SELECT department, AVG(salary) AS average_salary FROM employees GROUP BY department;",
  },
  
];