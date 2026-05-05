// // scripts/seedProblem.ts

// import { Pool } from 'pg'
// import { prisma } from '../lib/prisma'

// // Admin pool uses the main DATABASE_URL (full privileges)
// const adminPool = new Pool({ 
//   connectionString: process.env.DATABASE_URL,
//   // Neon direct connection recommended for DDL
//   ssl: { rejectUnauthorized: false }
// })

// async function seed() {
//   try {
//     // 1. Create problem record in Prisma
//     const problem = await prisma.problem.create({
//       data: {
//         title: 'Select all employees',
//         description: 'Write a query to return all rows from the employees table.',
//         difficulty: 'EASY',
//         schemaSql: `
//           CREATE TABLE employees (id INT, name TEXT, salary INT);
//           INSERT INTO employees VALUES (1, 'Alice', 5000), (2, 'Bob', 6000);
//         `,
//         solutionQuery: 'SELECT * FROM employees ORDER BY id;',
//       }
//     })

//     console.log(`✅ Problem created with ID: ${problem.id}`)

//     const schemaName = `problem_${problem.id}`

//     // 2. Create dedicated schema and tables using admin connection
//     await adminPool.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`)
//     // Set search_path and run the schema SQL (create table + insert data)
//     await adminPool.query(`SET search_path TO ${schemaName}; ${problem.schemaSql}`)

//     // 3. Grant read-only access to the sql_runner user
//     await adminPool.query(`GRANT USAGE ON SCHEMA ${schemaName} TO sql_runner`)
//     await adminPool.query(`GRANT SELECT ON ALL TABLES IN SCHEMA ${schemaName} TO sql_runner`)

//     console.log(`🔐 Granted SELECT privileges on schema ${schemaName} to sql_runner`)

//     // 4. Precompute expected result using the read‑only executor
//     //    (this will use READONLY_DATABASE_URL and the sql_runner user)
//     const { executeQuery } = await import('../lib/sql/executor')
//     const { rows } = await executeQuery(problem.id, problem.solutionQuery, { addLimit: false })

//     // 5. Store expected result as JSON in the Problem table
//     await prisma.problem.update({
//       where: { id: problem.id },
//       data: { expectedResult: rows }
//     })

//     console.log(`📊 Expected result stored (${rows.length} rows). Problem ready!`)
//   } catch (error) {
//     console.error('❌ Seeding failed:', error)
//   } finally {
//     await adminPool.end()
//     await prisma.$disconnect()
//   }
// }

// seed()