const Content = require('../models/Content');
const Progress = require('../models/Progress');

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Teacher, Admin)
exports.createContent = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      grade,
      contentType,
      textContent,
      duration,
      tags,
      difficulty
    } = req.body;

    let fileUrl = '';
    let thumbnail = '';
    let fileSize = 0;

    // Handle file uploads
    if (req.files) {
      if (req.files.file) {
        fileUrl = `/uploads/${req.files.file[0].path.replace(/\\/g, '/')}`;
        fileSize = req.files.file[0].size;
      }
      if (req.files.thumbnail) {
        thumbnail = `/uploads/${req.files.thumbnail[0].path.replace(/\\/g, '/')}`;
      }
    }

    const content = await Content.create({
      title,
      description,
      subject,
      grade,
      contentType,
      fileUrl,
      textContent,
      thumbnail,
      duration: duration || 0,
      fileSize,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      difficulty: difficulty || 'beginner',
      createdBy: req.user.id,
      isPublished: false
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating content',
      error: error.message
    });
  }
};

// @desc    Get all content (with filters)
// @route   GET /api/content
// @access  Public
exports.getAllContent = async (req, res) => {
  try {
    const {
      subject,
      grade,
      contentType,
      difficulty,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (contentType) query.contentType = contentType;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const contents = await Content.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Content.countDocuments(query);

    res.status(200).json({
      success: true,
      data: contents,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Get single content
// @route   GET /api/content/:id
// @access  Public
exports.getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('createdBy', 'name email role');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Increment views
    content.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Teacher, Admin)
exports.updateContent = async (req, res) => {
  try {
    let content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check ownership or admin role
    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this content'
      });
    }

    // Update content
    content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Teacher, Admin)
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check ownership or admin role
    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this content'
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message
    });
  }
};

// @desc    Publish/Unpublish content
// @route   PATCH /api/content/:id/publish
// @access  Private (Teacher, Admin)
exports.togglePublish = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.isPublished = !content.isPublished;
    await content.save();

    res.status(200).json({
      success: true,
      message: `Content ${content.isPublished ? 'published' : 'unpublished'} successfully`,
      data: content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
};

// @desc    Like/Unlike content
// @route   POST /api/content/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    const userIndex = content.likes.indexOf(req.user.id);

    if (userIndex > -1) {
      // Unlike
      content.likes.splice(userIndex, 1);
    } else {
      // Like
      content.likes.push(req.user.id);
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: userIndex > -1 ? 'Content unliked' : 'Content liked',
      data: { likes: content.likes.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating like',
      error: error.message
    });
  }
};

// @desc    Increment download count
// @route   POST /api/content/:id/download
// @access  Private
exports.incrementDownload = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    content.downloads += 1;
    await content.save();

    res.status(200).json({
      success: true,
      message: 'Download count updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating download count',
      error: error.message
    });
  }
};
