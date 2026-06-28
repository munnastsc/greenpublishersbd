"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const BookController_1 = require("./controllers/BookController");
const CategoryController_1 = require("./controllers/CategoryController");
const AdminController_1 = require("./controllers/AdminController");
const UpdateController_1 = require("./controllers/UpdateController");
const MediaController_1 = require("./controllers/MediaController");
const ActivationController_1 = require("./controllers/ActivationController");
const AuthorController_1 = require("./controllers/AuthorController");
const PublisherController_1 = require("./controllers/PublisherController");
const UnitController_1 = require("./controllers/UnitController");
const OrderController_1 = require("./controllers/OrderController");
const CouponController_1 = require("./controllers/CouponController");
const UserController_1 = require("./controllers/UserController");
const HomeSectionController_1 = require("./controllers/HomeSectionController");
const MenuItemController_1 = require("./controllers/MenuItemController");
const EducationalMaterialController_1 = require("./controllers/EducationalMaterialController");
const TrainingManualController_1 = require("./controllers/TrainingManualController");
const CustomPageController_1 = require("./controllers/CustomPageController");
const BannerController_1 = require("./controllers/BannerController");
const VideoController_1 = require("./controllers/VideoController");
const AudioLessonController_1 = require("./controllers/AudioLessonController");
const AuthController_1 = require("./controllers/AuthController");
// Adding POST/PUT/DELETE for existing controllers in a safe way if they don't exist
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Static file serving for uploads (if any)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Serve React Frontend (Vite dist)
app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/dist')));
// API Routes
app.get('/api/books', BookController_1.BookController.getAll);
app.get('/api/books/:id', BookController_1.BookController.getById);
app.get('/api/categories', CategoryController_1.CategoryController.getAll);
app.get('/api/categories/:categoryId/books', BookController_1.BookController.getByCategory);
// Auth Routes
app.post('/api/auth/register', AuthController_1.AuthController.register);
app.post('/api/auth/login', AuthController_1.AuthController.login);
// Generated CRUD Routes
app.get('/api/authors', AuthorController_1.AuthorController.getAll);
app.get('/api/authors/:id', AuthorController_1.AuthorController.getById);
app.post('/api/authors', AuthorController_1.AuthorController.create);
app.put('/api/authors/:id', AuthorController_1.AuthorController.update);
app.delete('/api/authors/:id', AuthorController_1.AuthorController.delete);
app.get('/api/publishers', PublisherController_1.PublisherController.getAll);
app.get('/api/publishers/:id', PublisherController_1.PublisherController.getById);
app.post('/api/publishers', PublisherController_1.PublisherController.create);
app.put('/api/publishers/:id', PublisherController_1.PublisherController.update);
app.delete('/api/publishers/:id', PublisherController_1.PublisherController.delete);
app.get('/api/units', UnitController_1.UnitController.getAll);
app.get('/api/units/:id', UnitController_1.UnitController.getById);
app.post('/api/units', UnitController_1.UnitController.create);
app.put('/api/units/:id', UnitController_1.UnitController.update);
app.delete('/api/units/:id', UnitController_1.UnitController.delete);
app.get('/api/orders', OrderController_1.OrderController.getAll);
app.get('/api/orders/:id', OrderController_1.OrderController.getById);
app.post('/api/orders', OrderController_1.OrderController.create);
app.put('/api/orders/:id', OrderController_1.OrderController.update);
app.delete('/api/orders/:id', OrderController_1.OrderController.delete);
app.get('/api/coupons', CouponController_1.CouponController.getAll);
app.get('/api/coupons/:id', CouponController_1.CouponController.getById);
app.post('/api/coupons', CouponController_1.CouponController.create);
app.put('/api/coupons/:id', CouponController_1.CouponController.update);
app.delete('/api/coupons/:id', CouponController_1.CouponController.delete);
app.get('/api/users', UserController_1.UserController.getAll);
app.get('/api/users/:id', UserController_1.UserController.getById);
app.post('/api/users', UserController_1.UserController.create);
app.put('/api/users/:id', UserController_1.UserController.update);
app.delete('/api/users/:id', UserController_1.UserController.delete);
app.get('/api/homesections', HomeSectionController_1.HomeSectionController.getAll);
app.get('/api/homesections/:id', HomeSectionController_1.HomeSectionController.getById);
app.post('/api/homesections', HomeSectionController_1.HomeSectionController.create);
app.put('/api/homesections/:id', HomeSectionController_1.HomeSectionController.update);
app.delete('/api/homesections/:id', HomeSectionController_1.HomeSectionController.delete);
app.get('/api/menuitems', MenuItemController_1.MenuItemController.getAll);
app.get('/api/menuitems/:id', MenuItemController_1.MenuItemController.getById);
app.post('/api/menuitems', MenuItemController_1.MenuItemController.create);
app.put('/api/menuitems/:id', MenuItemController_1.MenuItemController.update);
app.delete('/api/menuitems/:id', MenuItemController_1.MenuItemController.delete);
app.get('/api/educationalmaterials', EducationalMaterialController_1.EducationalMaterialController.getAll);
app.get('/api/educationalmaterials/:id', EducationalMaterialController_1.EducationalMaterialController.getById);
app.post('/api/educationalmaterials', EducationalMaterialController_1.EducationalMaterialController.create);
app.put('/api/educationalmaterials/:id', EducationalMaterialController_1.EducationalMaterialController.update);
app.delete('/api/educationalmaterials/:id', EducationalMaterialController_1.EducationalMaterialController.delete);
app.get('/api/trainingmanuals', TrainingManualController_1.TrainingManualController.getAll);
app.get('/api/trainingmanuals/:id', TrainingManualController_1.TrainingManualController.getById);
app.post('/api/trainingmanuals', TrainingManualController_1.TrainingManualController.create);
app.put('/api/trainingmanuals/:id', TrainingManualController_1.TrainingManualController.update);
app.delete('/api/trainingmanuals/:id', TrainingManualController_1.TrainingManualController.delete);
app.get('/api/custompages', CustomPageController_1.CustomPageController.getAll);
app.get('/api/custompages/:id', CustomPageController_1.CustomPageController.getById);
app.post('/api/custompages', CustomPageController_1.CustomPageController.create);
app.put('/api/custompages/:id', CustomPageController_1.CustomPageController.update);
app.delete('/api/custompages/:id', CustomPageController_1.CustomPageController.delete);
app.get('/api/banners', BannerController_1.BannerController.getAll);
app.get('/api/banners/:id', BannerController_1.BannerController.getById);
app.post('/api/banners', BannerController_1.BannerController.create);
app.put('/api/banners/:id', BannerController_1.BannerController.update);
app.delete('/api/banners/:id', BannerController_1.BannerController.delete);
app.get('/api/videos', VideoController_1.VideoController.getAll);
app.get('/api/videos/:id', VideoController_1.VideoController.getById);
app.post('/api/videos', VideoController_1.VideoController.create);
app.put('/api/videos/:id', VideoController_1.VideoController.update);
app.delete('/api/videos/:id', VideoController_1.VideoController.delete);
app.get('/api/audio', AudioLessonController_1.AudioLessonController.getAll);
app.get('/api/audio/:id', AudioLessonController_1.AudioLessonController.getById);
app.post('/api/audio', AudioLessonController_1.AudioLessonController.create);
app.put('/api/audio/:id', AudioLessonController_1.AudioLessonController.update);
app.delete('/api/audio/:id', AudioLessonController_1.AudioLessonController.delete);
app.post('/api/books', BookController_1.BookController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/books/:id', BookController_1.BookController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/books/:id', BookController_1.BookController.delete || ((req, res) => res.status(501).send('Not implemented')));
// Activation Codes
app.post('/api/activation/validate', ActivationController_1.ActivationController.validate);
app.post('/api/activation/bulk', ActivationController_1.ActivationController.bulkGenerate);
app.get('/api/activation/export', ActivationController_1.ActivationController.exportCsv);
app.get('/api/activation', ActivationController_1.ActivationController.getAll);
app.get('/api/activation/:id', ActivationController_1.ActivationController.getById);
app.post('/api/activation', ActivationController_1.ActivationController.create);
app.put('/api/activation/:id', ActivationController_1.ActivationController.update);
app.delete('/api/activation/:id', ActivationController_1.ActivationController.delete);
app.post('/api/categories', CategoryController_1.CategoryController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/categories/:id', CategoryController_1.CategoryController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/categories/:id', CategoryController_1.CategoryController.delete || ((req, res) => res.status(501).send('Not implemented')));
// Media & Activation Routes
// (videos and audio are now handled by generated CRUD routes)
app.get('/api/education-tools', MediaController_1.MediaController.getEducationTools);
app.get('/api/training-manuals', MediaController_1.MediaController.getTrainingManuals);
app.post('/api/activation/validate', ActivationController_1.ActivationController.validate);
app.post('/api/admin/login', AdminController_1.AdminController.login);
app.get('/api/admin/stats', AdminController_1.AdminController.getDashboardStats);
app.post('/api/admin/system/update', UpdateController_1.UpdateController.performUpdate);
// Catch-all route to serve React's index.html for React Router
app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path_1.default.join(__dirname, '../../frontend/dist/index.html'));
    }
    else {
        next();
    }
});
// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Green Publishers API is running perfectly!' });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
