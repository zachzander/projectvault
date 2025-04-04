import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define possible roles - even if we're only using "member" for now
export const projectSources = ["MANUAL_UPLOAD", "GITHUB", "WEB"] as const;
export const roles = v.union(v.literal("admin"), v.literal("member"));
export const domains = [
  "Artificial Intelligence (AI) & Machine Learning (ML)",
  "Cybersecurity",
  "Cloud Computing",
  "Data Science & Analytics",
  "Web Development",
  "Mobile App Development",
  "Internet of Things (IoT)",
  "Computer Vision",
  "Software Engineering",
  "Information Retrieval",
  "Blockchain",
  "DevOps & Automation",
  "Operating Systems",
  "Computer Networks",
  "Network Security",
  "Artificial Neural Networks",
  "Embedded Systems",
  "Computer Graphics",
  "Data Structures & Algorithms",
  "Natural Language Processing (NLP)",
  "Game Development",
  "Bioinformatics",
  "Database Management Systems",
  "Quantum Computing",
  "Augmented Reality (AR) & Virtual Reality (VR)",
  "Geographic Information Systems (GIS)",
  "Automation & Robotics",
] as const;
export type ProjectSource = typeof projectSources[number];
export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.object({
      orgId: v.string(),
      role: roles, // This ensures only valid roles can be stored
    })),
    name: v.string(),
    image: v.string(),
    email: v.string(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  
  files: defineTable({
    title: v.string(),
    description: v.string(),
    orgId: v.optional(v.string()),
    url: v.string(),
    storageId: v.string(),
    type: v.string(),
    size: v.number(),
    domains: v.array(v.string()),
    userId: v.string(),
    createdAt: v.number(),
    year: v.string(),
    publicationLink: v.optional(v.string()),
  })
  .index("by_org", ["orgId"])
  .index("by_user", ["userId"])
  .index("by_creation", ["createdAt"]),
});
