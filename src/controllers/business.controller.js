import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {Business} from '../models/business.model.js' 
import {apiResponse} from '../utils/apiResponse.js'

const createBusiness = asyncHandler(async (req, res) => {
    const { name, address, category, phone, email, slots } = req.body;
    if (!name || !address || !phone || !category || !email || !slots) {
        throw new apiError(400, 'Please fill all the required fields')
    }
    const business = await Business.create({
        owner: req.user._id,
        name, address, category, phone, email, slots
    })
    return res
    .status(201)
    .json(new apiResponse(201, business, 'Business created successfully'))
})

const getBusinesses = asyncHandler(async (req, res) => {
    const businesses = await Business.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res
    .status(200)
    .json(new apiResponse(200, businesses, 'Businesses fetched successfully'))
})

const getBusinessById = asyncHandler(async (req, res) => {
    const business = await Business.findOne({ _id: req.params.id, owner: req.user._id });
    if (!business) {
        throw new apiError(404, 'Business not found')
    }
    return res
    .status(200)
    .json(new apiResponse(200, business, 'Business fetched successfully'))
})

const updateBusiness = asyncHandler(async (req, res) => {
    const { name, address, phone, email, slots } = req.body;

    if (!name && !address && !phone && !email && !slots) {
        throw new apiError(400, 'At least one field is required to update');
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (address) updateFields.address = address;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;
    if (slots) updateFields.slots = slots;

    const business = await Business.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!business) {
        throw new apiError(404, 'Business not found or unauthorized');
    }

    res.status(200).json({
        success: true,
        data: business
    });
});

const deleteBusiness = asyncHandler(async (req, res)=> {
    const business = await Business.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!business) {
        throw new apiError(404, 'Business not found or unauthorized');
    }
    return res
    .status(200)
    .json(new apiResponse(200, {}, 'Business deleted successfully'))
})

const findBusinessByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const businesses = await Business.find({ category: category }).sort({ createdAt: -1 });
    return res
    .status(200)
    .json(new apiResponse(200, businesses, 'Businesses fetched successfully'))
})

export {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    findBusinessByCategory,
}