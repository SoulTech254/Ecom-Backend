import Branch from "../models/branch.model.js";
export const getBranchesHandler = async (req, res, next) => {
  try {
    const branches = await Branch.find({}, "_id name").lean();

    if (!branches) {
      return res.json([]);
    }

    const formattedBranches = branches.map((branch) => ({
      label: branch.name,
      value: branch.name, 
      id: branch._id
    }));

    res.json(formattedBranches);
  } catch (error) {
    next(error);
  }
};
