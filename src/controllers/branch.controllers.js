import Branch from "../models/branch.model.js";
export const getBranchesHandler = async (req, res, next) => {
  try {
    console.log("Fetching branches...");
    const branches = await Branch.find({}, "_id name").lean();

    if (!branches) {
      console.log("No branches found.");
      return []; // Return empty array if no branches found
    }

    console.log("Formatting branches...");
    const formattedBranches = branches.map((branch) => ({
      label: branch.name,
      value: branch.name, 
      id: branch._id
    }));

    console.log("Branches fetched and formatted successfully.");
    console.log(formattedBranches);
    res.json(formattedBranches);
  } catch (error) {
    console.log("Error fetching branches:", error);
    next(error);
  }
};
