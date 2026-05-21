<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Konfirmasi Janji Temu</title>
</head>
<body style="font-family: Arial, sans-serif; color: #102a43; background: #f8fafc; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0;">
        <h1 style="font-size: 1.75rem; margin-bottom: 1rem; color: #0f172a;">Janji temu berhasil dibuat</h1>
        <p>Halo {{ $appointment->patient->user->name }},</p>
        <p>Terima kasih telah membuat janji temu. Berikut detail appointment Anda:</p>

        <ul style="list-style: none; padding: 0;">
            <li><strong>Dokter:</strong> {{ $appointment->doctor->user->name ?? 'N/A' }}</li>
            <li><strong>Spesialisasi:</strong> {{ $appointment->doctor->specialization ?? 'N/A' }}</li>
            <li><strong>Tanggal:</strong> {{ $appointment->timeSlot->date ?? 'N/A' }}</li>
            <li><strong>Waktu:</strong> {{ $appointment->timeSlot->start_time ?? 'N/A' }} - {{ $appointment->timeSlot->end_time ?? 'N/A' }}</li>
            <li><strong>Status:</strong> {{ ucfirst($appointment->status) }}</li>
            @if($appointment->notes)
                <li><strong>Catatan:</strong> {{ $appointment->notes }}</li>
            @endif
        </ul>

        <p>Silakan datang tepat waktu dan hubungi kami jika ada perubahan.</p>
        <p>Salam sehat,</p>
        <p><strong>Tim Healthcare App</strong></p>
    </div>
</body>
</html>
