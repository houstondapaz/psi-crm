#!/usr/bin/env -S node
import { Migration, MigrationCLI, addColumn } from '@prisma-next/postgres/migration';

export default class M extends Migration {
  override describe() {
    return {
      from: 'sha256:64eb305fd65de6ad37a2986e1bd42a3f5b05d839a4be293c49168e8318c0ed7e',
      to: 'sha256:342ee54df6f55a096b51a42899a93f9b591b4f1e7b116607ddb4fc1a860ee50a',
    };
  }

  override get operations() {
    return [
      addColumn('public', 'patient', {
        name: 'status',
        typeSql: 'text',
        defaultSql: "DEFAULT 'patient'",
        nullable: false,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
