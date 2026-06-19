#!/usr/bin/env -S node
import { Migration, MigrationCLI, addColumn } from '@prisma-next/postgres/migration';

export default class M extends Migration {
  override describe() {
    return {
      from: 'sha256:6b50e39254a19592f2733ab5f90125a875bb373345d7410dac2218bf72575f10',
      to: 'sha256:47e4239eeb297e17be46a316cc6d9e423bcafa2b712f16cb5d3fe46ae969193e',
    };
  }

  override get operations() {
    return [
      addColumn('public', 'patient', {
        name: 'address',
        typeSql: 'text',
        defaultSql: '',
        nullable: true,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
