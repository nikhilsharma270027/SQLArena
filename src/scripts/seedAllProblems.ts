// scripts/seedAllProblems.ts
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { prisma } from '../lib/prisma'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

const adminPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Helper function to create schema and grant permissions
async function createProblemSchema(problemId: string, schemaSql: string) {
  const schemaName = `problem_${problemId}`
  
  // Create schema
  await adminPool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
  
  // Create tables and insert data
  await adminPool.query(`SET search_path TO ${schemaName}; ${schemaSql}`)
  
  // Grant read-only access
  await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
  await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)
  
  console.log(`   ✅ Schema ${schemaName} created with permissions`)
}

// Problem definitions
const problems = [
  // ========== EASY PROBLEMS ==========
  {
    title: 'Select All Employees',
    description: `Write a query to return all rows from the employees table.

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- salary (INT)
\`\`\`

**Sample Data:**
| id | name  | salary |
|----|-------|--------|
| 1  | Alice | 5000   |
| 2  | Bob   | 6000   |

**Expected Output:**
| id | name  | salary |
|----|-------|--------|
| 1  | Alice | 5000   |
| 2  | Bob   | 6000   |`,
    difficulty: 'EASY',
    schemaSql: `
      CREATE TABLE employees (
        id INT,
        name TEXT,
        salary INT
      );
      INSERT INTO employees VALUES 
        (1, 'Alice', 5000),
        (2, 'Bob', 6000);
    `,
    solutionQuery: 'SELECT * FROM employees ORDER BY id;'
  },
  
  {
    title: 'Find Employees with High Salary',
    description: `Write a query to find all employees with a salary greater than 55000.

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- salary (INT)
- department (TEXT)
\`\`\`

**Sample Data:**
| id | name    | salary | department |
|----|---------|--------|------------|
| 1  | John    | 50000  | IT         |
| 2  | Sarah   | 60000  | HR         |
| 3  | Mike    | 75000  | IT         |
| 4  | Emma    | 45000  | Finance    |

**Expected Output:**
| id | name  | salary | department |
|----|-------|--------|------------|
| 2  | Sarah | 60000  | HR         |
| 3  | Mike  | 75000  | IT         |`,
    difficulty: 'EASY',
    schemaSql: `
      CREATE TABLE employees (
        id INT,
        name TEXT,
        salary INT,
        department TEXT
      );
      INSERT INTO employees VALUES 
        (1, 'John', 50000, 'IT'),
        (2, 'Sarah', 60000, 'HR'),
        (3, 'Mike', 75000, 'IT'),
        (4, 'Emma', 45000, 'Finance');
    `,
    solutionQuery: "SELECT * FROM employees WHERE salary > 55000 ORDER BY id;"
  },
  
  // ========== MEDIUM PROBLEMS ==========
  {
    title: 'Employee Count by Department',
    description: `Write a query to count the number of employees in each department. Return department name and employee count, sorted by department name.

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- department_id (INT)

departments
- id (INT)
- name (TEXT)
\`\`\`

**Sample Data:**
\`employees\`:
| id | name    | department_id |
|----|---------|---------------|
| 1  | Alice   | 1             |
| 2  | Bob     | 2             |
| 3  | Charlie | 1             |
| 4  | David   | 3             |

\`departments\`:
| id | name         |
|----|--------------|
| 1  | Engineering  |
| 2  | Sales        |
| 3  | Marketing    |

**Expected Output:**
| department_name | employee_count |
|-----------------|----------------|
| Engineering     | 2              |
| Marketing       | 1              |
| Sales           | 1              |`,
    difficulty: 'MEDIUM',
    schemaSql: `
      CREATE TABLE departments (
        id INT,
        name TEXT
      );
      INSERT INTO departments VALUES 
        (1, 'Engineering'),
        (2, 'Sales'),
        (3, 'Marketing');
      
      CREATE TABLE employees (
        id INT,
        name TEXT,
        department_id INT
      );
      INSERT INTO employees VALUES 
        (1, 'Alice', 1),
        (2, 'Bob', 2),
        (3, 'Charlie', 1),
        (4, 'David', 3);
    `,
    solutionQuery: `
      SELECT d.name AS department_name, COUNT(e.id) AS employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id, d.name
      ORDER BY d.name;
    `
  },
  
  {
    title: 'Find Highest Paid Employee per Department',
    description: `Write a query to find the employee with the highest salary in each department. Return department name, employee name, and salary.

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- salary (INT)
- department (TEXT)
\`\`\`

**Sample Data:**
| id | name    | salary | department |
|----|---------|--------|------------|
| 1  | Alice   | 50000  | IT         |
| 2  | Bob     | 60000  | IT         |
| 3  | Charlie | 70000  | HR         |
| 4  | David   | 55000  | HR         |
| 5  | Emma    | 80000  | Sales      |

**Expected Output:**
| department | employee_name | salary |
|------------|---------------|--------|
| HR         | Charlie       | 70000  |
| IT         | Bob           | 60000  |
| Sales      | Emma          | 80000  |`,
    difficulty: 'MEDIUM',
    schemaSql: `
      CREATE TABLE employees (
        id INT,
        name TEXT,
        salary INT,
        department TEXT
      );
      INSERT INTO employees VALUES 
        (1, 'Alice', 50000, 'IT'),
        (2, 'Bob', 60000, 'IT'),
        (3, 'Charlie', 70000, 'HR'),
        (4, 'David', 55000, 'HR'),
        (5, 'Emma', 80000, 'Sales');
    `,
    solutionQuery: `
      SELECT department, name AS employee_name, salary
      FROM employees e1
      WHERE salary = (
        SELECT MAX(salary)
        FROM employees e2
        WHERE e2.department = e1.department
      )
      ORDER BY department;
    `
  },
  
  // ========== HARD PROBLEMS ==========
  {
    title: 'Find Employees Earning More Than Manager',
    description: `Write a query to find employees who earn more than their manager.

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- salary (INT)
- manager_id (INT)  -- NULL for top-level managers
\`\`\`

**Sample Data:**
| id | name     | salary | manager_id |
|----|----------|--------|------------|
| 1  | John     | 100000 | NULL       |
| 2  | Alice    | 80000  | 1          |
| 3  | Bob      | 90000  | 1          |
| 4  | Charlie  | 110000 | 2          |
| 5  | David    | 75000  | 3          |

**Expected Output:**
| employee_name | employee_salary | manager_name | manager_salary |
|---------------|----------------|--------------|----------------|
| Charlie       | 110000          | Alice        | 80000          |`,
    difficulty: 'HARD',
    schemaSql: `
      CREATE TABLE employees (
        id INT,
        name TEXT,
        salary INT,
        manager_id INT
      );
      INSERT INTO employees VALUES 
        (1, 'John', 100000, NULL),
        (2, 'Alice', 80000, 1),
        (3, 'Bob', 90000, 1),
        (4, 'Charlie', 110000, 2),
        (5, 'David', 75000, 3);
    `,
    solutionQuery: `
      SELECT 
        e1.name AS employee_name,
        e1.salary AS employee_salary,
        e2.name AS manager_name,
        e2.salary AS manager_salary
      FROM employees e1
      JOIN employees e2 ON e1.manager_id = e2.id
      WHERE e1.salary > e2.salary;
    `
  },
  
  {
    title: 'Department Salary Analytics',
    description: `Write a query to show department salary analytics including:
- Total salary per department
- Average salary per department
- Number of employees
- Rank departments by average salary (highest first)

**Table Schema:**
\`\`\`
employees
- id (INT)
- name (TEXT)
- salary (INT)
- department (TEXT)
\`\`\`

**Sample Data:**
| id | name    | salary | department |
|----|---------|--------|------------|
| 1  | Alice   | 50000  | IT         |
| 2  | Bob     | 60000  | IT         |
| 3  | Charlie | 90000  | IT         |
| 4  | David   | 55000  | HR         |
| 5  | Emma    | 65000  | HR         |
| 6  | Frank   | 40000  | Marketing  |

**Expected Output:**
| department | total_salary | avg_salary | employee_count | rank |
|------------|--------------|------------|----------------|------|
| IT         | 200000       | 66666.67   | 3              | 1    |
| HR         | 120000       | 60000.00   | 2              | 2    |
| Marketing  | 40000        | 40000.00   | 1              | 3    |`,
    difficulty: 'HARD',
    schemaSql: `
      CREATE TABLE employees (
        id INT,
        name TEXT,
        salary INT,
        department TEXT
      );
      INSERT INTO employees VALUES 
        (1, 'Alice', 50000, 'IT'),
        (2, 'Bob', 60000, 'IT'),
        (3, 'Charlie', 90000, 'IT'),
        (4, 'David', 55000, 'HR'),
        (5, 'Emma', 65000, 'HR'),
        (6, 'Frank', 40000, 'Marketing');
    `,
    solutionQuery: `
      SELECT 
        department,
        SUM(salary) AS total_salary,
        ROUND(AVG(salary), 2) AS avg_salary,
        COUNT(*) AS employee_count,
        RANK() OVER (ORDER BY AVG(salary) DESC) AS rank
      FROM employees
      GROUP BY department
      ORDER BY rank;
    `
  }
]

async function seedAllProblems() {
  console.log('🌱 Starting to seed problems...\n')
  
  for (let i = 0; i < problems.length; i++) {
    const problemData = problems[i]
    console.log(`📝 Creating problem ${i + 1}/6: ${problemData.title}`)
    
    try {
      // 1. Create problem record
      const problem = await prisma.problem.create({
        data: {
          title: problemData.title,
          description: problemData.description,
          difficulty: problemData.difficulty as any,
          schemaSql: problemData.schemaSql,
          solutionQuery: problemData.solutionQuery,
        }
      })
      
      console.log(`   ✅ Problem created with ID: ${problem.id}`)
      
      // 2. Create database schema and grant permissions
      await createProblemSchema(problem.id, problemData.schemaSql)
      
      // 3. Precompute expected result
      const { executeUserQuery } = await import('../lib/sql/executor')
      const { rows } = await executeUserQuery(problem.id, problemData.solutionQuery)
      
      // 4. Store expected result
      await prisma.problem.update({
        where: { id: problem.id },
        data: { expectedResult: rows }
      })
      
      console.log(`   📊 Expected result stored (${rows.length} rows)\n`)
      
    } catch (error) {
      console.error(`   ❌ Failed to create problem: ${problemData.title}`, error)
    }
  }
  
  console.log('✅ All problems seeded successfully!')
  
  // Print summary
  const problemsByDifficulty = await prisma.problem.groupBy({
    by: ['difficulty'],
    _count: { id: true }
  })
  
  console.log('\n📈 Summary:')
  problemsByDifficulty.forEach(group => {
    console.log(`   ${group.difficulty}: ${group._count.id} problems`)
  })
  
  await adminPool.end()
  await prisma.$disconnect()
}

// Run the seeding
seedAllProblems().catch(console.error)