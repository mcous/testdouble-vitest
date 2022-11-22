# Example usage of testdouble-vitest

This is a fake API for retrieving a "report". It consists of:

- A main [getReport] unit - our test subject
- Two dependencies the subject delegates to:
  - [loadReportData] to get report data from some data store
  - [generateReport] to create a report from the source data

Using `vitest` along with `testdouble` and `testdouble-vitest` to inject fake versions of our dependencies, we wrote a [test suite][] to design how our subject delegates its work to its dependencies.

[getreport]: ./get-report.ts
[loadreportdata]: ./load-report-data.ts
[generatereport]: ./generate-report.ts
[test suite]: ./get-report.test.ts
