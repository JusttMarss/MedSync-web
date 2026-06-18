<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\WebAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\TimeSlotController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/doctors', [PageController::class, 'doctors'])->name('doctors');
Route::get('/doctors/{id}', [PageController::class, 'doctorProfile'])->name('doctor.profile');

Route::middleware('guest')->group(function () {
    Route::get('/login', [WebAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [WebAuthController::class, 'login'])->name('login.post');
    Route::get('/register', [WebAuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [WebAuthController::class, 'register'])->name('register.post');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('/appointments', [PageController::class, 'appointments'])->name('appointments');
    Route::post('/appointments', [AppointmentController::class, 'store'])->name('appointments.store');
    Route::put('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->name('appointments.status.update');
    Route::get('/schedule', [PageController::class, 'schedule'])->name('schedule');
    Route::get('/schedule/{id}', [PageController::class, 'scheduleDetail'])->name('schedule.detail');
    Route::get('/profile', [PageController::class, 'profile'])->name('profile');
    Route::post('/profile/update', [PageController::class, 'updateProfile'])->name('profile.update');
    Route::get('/dashboard', [PageController::class, 'dashboard'])->name('dashboard');
    Route::get('/medical-records', [PageController::class, 'medicalRecords'])->name('medical-records');

    // Admin Operations
    Route::post('/admin/doctors', [AdminController::class, 'storeDoctor'])->name('admin.doctors.store');
    Route::put('/admin/doctors/{id}', [AdminController::class, 'updateDoctor'])->name('admin.doctors.update');
    Route::delete('/admin/doctors/{id}', [AdminController::class, 'deleteDoctor'])->name('admin.doctors.destroy');

    Route::post('/admin/patients', [AdminController::class, 'storePatient'])->name('admin.patients.store');
    Route::put('/admin/patients/{id}', [AdminController::class, 'updatePatient'])->name('admin.patients.update');
    Route::delete('/admin/patients/{id}', [AdminController::class, 'deletePatient'])->name('admin.patients.destroy');

    Route::put('/admin/appointments/{id}/status', [AdminController::class, 'updateAppointmentStatus'])->name('admin.appointments.status');
    Route::delete('/admin/medical-records/{id}', [AdminController::class, 'deleteMedicalRecord'])->name('admin.medical-records.destroy');

    // ── Rekam Medis Admin (input manual) ─────────────────────────
    Route::post('/admin/medical-records', [AdminController::class, 'storeMedicalRecord'])->name('admin.medical-records.store');
    Route::put('/admin/medical-records/{id}', [AdminController::class, 'updateMedicalRecord'])->name('admin.medical-records.update');
    Route::delete('/admin/medical-records/{id}', [AdminController::class, 'deleteMedicalRecord'])->name('admin.medical-records.destroy');

    // Timeslot Operations
    Route::post('/timeslots', [TimeSlotController::class, 'store'])->name('timeslots.store');
    Route::put('/timeslots/{id}', [TimeSlotController::class, 'update'])->name('timeslots.update');
    Route::delete('/timeslots/{id}', [TimeSlotController::class, 'destroy'])->name('timeslots.destroy');
    });