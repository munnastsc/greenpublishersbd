import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { BookController } from './controllers/BookController';
import { CategoryController } from './controllers/CategoryController';
import { AdminController } from './controllers/AdminController';
import { UpdateController } from './controllers/UpdateController';
import { MediaController } from './controllers/MediaController';
import { ActivationController } from './controllers/ActivationController';
import { AuthorController } from './controllers/AuthorController';
import { PublisherController } from './controllers/PublisherController';
import { UnitController } from './controllers/UnitController';
import { OrderController } from './controllers/OrderController';
import { CouponController } from './controllers/CouponController';
import { UserController } from './controllers/UserController';
import { HomeSectionController } from './controllers/HomeSectionController';
import { MenuItemController } from './controllers/MenuItemController';
import { EducationalMaterialController } from './controllers/EducationalMaterialController';
import { TrainingManualController } from './controllers/TrainingManualController';
import { CustomPageController } from './controllers/CustomPageController';
import { BannerController } from './controllers/BannerController';
import { VideoController } from './controllers/VideoController';
import { AudioLessonController } from './controllers/AudioLessonController';
import { AuthController } from './controllers/AuthController';

// Adding POST/PUT/DELETE for existing controllers in a safe way if they don't exist

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Static file serving for uploads (if any)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve React Frontend (Vite dist)
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API Routes
app.get('/api/books', BookController.getAll);
app.get('/api/books/:id', BookController.getById);
app.get('/api/categories', CategoryController.getAll);
app.get('/api/categories/:categoryId/books', BookController.getByCategory);

// Auth Routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// Generated CRUD Routes

app.get('/api/authors', AuthorController.getAll);
app.get('/api/authors/:id', AuthorController.getById);
app.post('/api/authors', AuthorController.create);
app.put('/api/authors/:id', AuthorController.update);
app.delete('/api/authors/:id', AuthorController.delete);

app.get('/api/publishers', PublisherController.getAll);
app.get('/api/publishers/:id', PublisherController.getById);
app.post('/api/publishers', PublisherController.create);
app.put('/api/publishers/:id', PublisherController.update);
app.delete('/api/publishers/:id', PublisherController.delete);

app.get('/api/units', UnitController.getAll);
app.get('/api/units/:id', UnitController.getById);
app.post('/api/units', UnitController.create);
app.put('/api/units/:id', UnitController.update);
app.delete('/api/units/:id', UnitController.delete);

app.get('/api/orders', OrderController.getAll);
app.get('/api/orders/:id', OrderController.getById);
app.post('/api/orders', OrderController.create);
app.put('/api/orders/:id', OrderController.update);
app.delete('/api/orders/:id', OrderController.delete);

app.get('/api/coupons', CouponController.getAll);
app.get('/api/coupons/:id', CouponController.getById);
app.post('/api/coupons', CouponController.create);
app.put('/api/coupons/:id', CouponController.update);
app.delete('/api/coupons/:id', CouponController.delete);

app.get('/api/users', UserController.getAll);
app.get('/api/users/:id', UserController.getById);
app.post('/api/users', UserController.create);
app.put('/api/users/:id', UserController.update);
app.delete('/api/users/:id', UserController.delete);

app.get('/api/homesections', HomeSectionController.getAll);
app.get('/api/homesections/:id', HomeSectionController.getById);
app.post('/api/homesections', HomeSectionController.create);
app.put('/api/homesections/:id', HomeSectionController.update);
app.delete('/api/homesections/:id', HomeSectionController.delete);

app.get('/api/menuitems', MenuItemController.getAll);
app.get('/api/menuitems/:id', MenuItemController.getById);
app.post('/api/menuitems', MenuItemController.create);
app.put('/api/menuitems/:id', MenuItemController.update);
app.delete('/api/menuitems/:id', MenuItemController.delete);

app.get('/api/educationalmaterials', EducationalMaterialController.getAll);
app.get('/api/educationalmaterials/:id', EducationalMaterialController.getById);
app.post('/api/educationalmaterials', EducationalMaterialController.create);
app.put('/api/educationalmaterials/:id', EducationalMaterialController.update);
app.delete('/api/educationalmaterials/:id', EducationalMaterialController.delete);

app.get('/api/trainingmanuals', TrainingManualController.getAll);
app.get('/api/trainingmanuals/:id', TrainingManualController.getById);
app.post('/api/trainingmanuals', TrainingManualController.create);
app.put('/api/trainingmanuals/:id', TrainingManualController.update);
app.delete('/api/trainingmanuals/:id', TrainingManualController.delete);

app.get('/api/custompages', CustomPageController.getAll);
app.get('/api/custompages/:id', CustomPageController.getById);
app.post('/api/custompages', CustomPageController.create);
app.put('/api/custompages/:id', CustomPageController.update);
app.delete('/api/custompages/:id', CustomPageController.delete);

app.get('/api/banners', BannerController.getAll);
app.get('/api/banners/:id', BannerController.getById);
app.post('/api/banners', BannerController.create);
app.put('/api/banners/:id', BannerController.update);
app.delete('/api/banners/:id', BannerController.delete);

app.get('/api/videos', VideoController.getAll);
app.get('/api/videos/:id', VideoController.getById);
app.post('/api/videos', VideoController.create);
app.put('/api/videos/:id', VideoController.update);
app.delete('/api/videos/:id', VideoController.delete);

app.get('/api/audio', AudioLessonController.getAll);
app.get('/api/audio/:id', AudioLessonController.getById);
app.post('/api/audio', AudioLessonController.create);
app.put('/api/audio/:id', AudioLessonController.update);
app.delete('/api/audio/:id', AudioLessonController.delete);

app.post('/api/books', BookController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/books/:id', BookController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/books/:id', BookController.delete || ((req, res) => res.status(501).send('Not implemented')));

app.get('/api/activation', ActivationController.getAll);
app.get('/api/activation/:id', ActivationController.getById);
app.post('/api/activation', ActivationController.create);
app.put('/api/activation/:id', ActivationController.update);
app.delete('/api/activation/:id', ActivationController.delete);

app.post('/api/categories', CategoryController.create || ((req, res) => res.status(501).send('Not implemented')));
app.put('/api/categories/:id', CategoryController.update || ((req, res) => res.status(501).send('Not implemented')));
app.delete('/api/categories/:id', CategoryController.delete || ((req, res) => res.status(501).send('Not implemented')));

// Media & Activation Routes
// (videos and audio are now handled by generated CRUD routes)
app.get('/api/education-tools', MediaController.getEducationTools);
app.get('/api/training-manuals', MediaController.getTrainingManuals);
app.post('/api/activation/validate', ActivationController.validate);
app.post('/api/admin/login', AdminController.login);
app.get('/api/admin/stats', AdminController.getDashboardStats);
app.post('/api/admin/system/update', UpdateController.performUpdate);

// Catch-all route to serve React's index.html for React Router
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  } else {
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
