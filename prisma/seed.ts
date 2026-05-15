// Run with: npx ts-node prisma/seed.ts
// Or add to package.json scripts: "db:seed": "ts-node prisma/seed.ts"
// This seeds the database with the initial playbooks and bundles

import { PrismaClient } from '@prisma/client'
import { PLAYBOOK_SEED_DATA, BUNDLE_SEED_DATA } from '../src/lib/playbooks-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding playbooks...')

  for (const pb of PLAYBOOK_SEED_DATA) {
    await prisma.playbook.upsert({
      where: { slug: pb.slug },
      update: {
        title: pb.title,
        description: pb.description,
        longDescription: pb.longDescription,
        price: pb.price,
        previewContent: pb.previewContent,
        category: pb.category,
        tags: pb.tags,
        featured: pb.featured,
        published: pb.published,
      },
      create: {
        title: pb.title,
        slug: pb.slug,
        description: pb.description,
        longDescription: pb.longDescription,
        price: pb.price,
        previewContent: pb.previewContent,
        category: pb.category,
        tags: pb.tags,
        featured: pb.featured,
        published: pb.published,
        isBundle: false,
      },
    })
    console.log(`  ✓ ${pb.title}`)
  }

  console.log('Seeding bundles...')
  for (const bundle of BUNDLE_SEED_DATA) {
    const created = await prisma.playbook.upsert({
      where: { slug: bundle.slug },
      update: {
        title: bundle.title,
        description: bundle.description,
        price: bundle.price,
        previewContent: bundle.previewContent,
        category: bundle.category,
        featured: bundle.featured,
        published: bundle.published,
        isBundle: true,
      },
      create: {
        title: bundle.title,
        slug: bundle.slug,
        description: bundle.description,
        price: bundle.price,
        previewContent: bundle.previewContent,
        category: bundle.category,
        featured: bundle.featured,
        published: bundle.published,
        isBundle: true,
      },
    })

    // Create bundle items
    for (const playbookSlug of bundle.playbookSlugs) {
      const playbook = await prisma.playbook.findUnique({ where: { slug: playbookSlug } })
      if (playbook) {
        await prisma.bundleItem.upsert({
          where: { bundleId_playbookId: { bundleId: created.id, playbookId: playbook.id } },
          update: {},
          create: { bundleId: created.id, playbookId: playbook.id },
        })
      }
    }
    console.log(`  ✓ ${bundle.title}`)
  }

  console.log('Seeding complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
