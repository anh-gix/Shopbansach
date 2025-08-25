const Community = require("../models/community");

exports.createCommunity = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community name already exists" });
    }
    const newCommunity = new Community({ name, description, members });
    await newCommunity.save();
    res.status(201).json({
      message: "Community created successfully",
      community: newCommunity,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating community", error: err });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching communities", error: err });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(200).json(community);
  } catch (err) {
    res.status(500).json({ message: "Error fetching community", error: err });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const { id } = req.params;

    // Tìm cộng đồng hiện tại
    const currentCommunity = await Community.findById(id);
    if (!currentCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Kiểm tra trùng tên chỉ khi name thay đổi
    if (name && name !== currentCommunity.name) {
      const existingCommunity = await Community.findOne({ name });
      if (existingCommunity) {
        return res
          .status(400)
          .json({ message: "Community name already exists" });
      }
    }

    // Cập nhật thông tin
    currentCommunity.name = name || currentCommunity.name;
    currentCommunity.description = description || currentCommunity.description;
    currentCommunity.members = members || currentCommunity.members;
    currentCommunity.updatedAt = Date.now();

    await currentCommunity.save();

    res.status(200).json({
      message: "Community updated successfully",
      community: currentCommunity,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating community", error: err.message });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Community.findByIdAndDelete(id);
    if (response) {
      res.status(200).json({ message: "successfully!" });
    } else {
      res.status(400).json({ message: "unsuccessfully!" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.addMemberToCommounity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedCommunity = await Community.findByIdAndUpdate(
      id,
      {
        $addToSet: { members: userId },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({
      message: "User added to community successfully",
      community: updatedCommunity,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating community", error: err });
  }
};

exports.removeMemberFromCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedCommunity = await Community.findByIdAndUpdate(
      id,
      {
        $pull: { members: userId },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json({
      message: "User removed from community successfully",
      community: updatedCommunity,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating community", error: err });
  }
};
