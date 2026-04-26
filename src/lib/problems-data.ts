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
  {
    id: "4",
    title: "Employees with a Specific Job Title",
    description: "Write a query to find employees with a specific job title. Return their name, department, and job title.",
    difficulty: "Easy",
    points: 10,
    likes: 35,
    submissions: 110,
    examples: [
      { input: "Table employees", output: "Alice, Engineering, Engineer" },
    ],
    starterQuery: "SELECT name, department, job_title FROM employees WHERE job_title = 'Engineer';",
  },
  {
    id: "5",
    title: "Departments with More Than 5 Employees",
    description: "Write a query to find departments with more than 5 employees. Return the department name and the number of employees.",
    difficulty: "Hard",
    points: 15,
    likes: 30,
    submissions: 95,
    examples: [
      { input: "Table employees", output: "Sales, 3" },
    ],
    starterQuery: "SELECT department, COUNT(*) AS num_employees FROM employees GROUP BY department HAVING COUNT(*) > 5;",
  },
  
];