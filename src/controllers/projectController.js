import Project from '../models/Project.js';
import mongoose from 'mongoose';

export async function getProjects(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const tech = req.query.tech?.trim();
    const filter = {};
    if (tech) {
      filter.technologies = new RegExp(
        tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter),
    ]);
    res.json({
      data: items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (e) {
    next(e);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (e) {
    next(e);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (e) {
    next(e);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid project id' });
    }
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Deleted', id });
  } catch (e) {
    next(e);
  }
}
