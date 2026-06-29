#!/usr/bin/env -S node
import {
  Migration,
  MigrationCLI,
  addColumn,
  addForeignKey,
  col,
  createIndex,
  fn,
  primaryKey,
} from '@prisma-next/postgres/migration';

export default class M extends Migration {
  override describe() {
    return {
      from: 'sha256:47e4239eeb297e17be46a316cc6d9e423bcafa2b712f16cb5d3fe46ae969193e',
      to: 'sha256:64eb305fd65de6ad37a2986e1bd42a3f5b05d839a4be293c49168e8318c0ed7e',
    };
  }

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'patientAnnotation',
        columns: [
          col('content', 'text', { notNull: true }),
          col('createdAt', 'timestamptz', { notNull: true, default: fn('now()') }),
          col('id', 'character(36)', { notNull: true }),
          col('patientId', 'text', { notNull: true }),
          col('practiceId', 'text', { notNull: true }),
          col('recordedAt', 'timestamptz', { notNull: true, default: fn('now()') }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      addColumn('public', 'patient', {
        name: 'description',
        typeSql: 'text',
        defaultSql: '',
        nullable: true,
      }),
      createIndex('public', 'patientAnnotation', 'patientAnnotation_practiceId_idx', [
        'practiceId',
      ]),
      createIndex('public', 'patientAnnotation', 'patientAnnotation_patientId_idx', ['patientId']),
      addForeignKey('public', 'patientAnnotation', {
        name: 'patientAnnotation_practiceId_fkey',
        columns: ['practiceId'],
        references: { schema: 'public', table: 'practice', columns: ['id'] },
        onDelete: 'cascade',
      }),
      addForeignKey('public', 'patientAnnotation', {
        name: 'patientAnnotation_patientId_fkey',
        columns: ['patientId'],
        references: { schema: 'public', table: 'patient', columns: ['id'] },
        onDelete: 'cascade',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
