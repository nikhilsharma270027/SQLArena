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

async function seedJoinProblem() {
  try {
    const problem = await prisma.problem.create({
      data: {
        title: 'Employees with Department Names',
        description: `Write a query that returns the employee name and their department name for all employees. Sort the results by employee id.

Expected columns: employee_name, department_name`,
        difficulty: 'MEDIUM',
        schemaSql: `
          CREATE TABLE departments (id INT, name TEXT);
          INSERT INTO departments VALUES (1, 'Engineering'), (2, 'Sales');

          CREATE TABLE employees (id INT, name TEXT, salary INT, dept_id INT);
          INSERT INTO employees VALUES (1, 'Alice', 5000, 1), (2, 'Bob', 6000, 2), (3, 'Charlie', 7000, 1);
        `,
        solutionQuery: `
          SELECT e.name AS employee_name, d.name AS department_name
          FROM employees e
          JOIN departments d ON e.dept_id = d.id
          ORDER BY e.id;
        `,
      }
    })

    console.log(`✅ Problem created with ID: ${problem.id}`)

    const schemaName = `problem_${problem.id}`
    await adminPool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
    await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)

    // Grant read-only access
    await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
    await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

    console.log(`🔐 Granted SELECT privileges on schema ${schemaName}`)

    // Precompute expected result (without LIMIT)
    const { executeQuery } = await import('../lib/sqlExecutor')
    const { rows } = await executeQuery(problem.id, problem.solutionQuery, { addLimit: false })

    await prisma.problem.update({
      where: { id: problem.id },
      data: { expectedResult: rows }
    })

    console.log(`📊 Expected result stored (${rows.length} rows). Problem ready!`)
    console.table(rows) // optional preview
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  } finally {
    await adminPool.end()
    await prisma.$disconnect()
  }
}

seedJoinProblem()