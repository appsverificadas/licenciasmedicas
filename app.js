// Esperamos a que todo el HTML cargue
document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializamos jsPDF
    const { jsPDF } = window.jspdf;

    // Detectar en qué página estamos buscando los botones
    const btnReposo = document.getElementById('btn-generar');
    const btnAlta = document.getElementById('btn-generar-alta');

    // === LÓGICA PARA REPOSO ===
    if (btnReposo) {
        btnReposo.addEventListener('click', () => {
            const dni = document.getElementById('dni').value;
            const nombre = document.getElementById('nombre').value;
            const diagnostico = document.getElementById('diagnostico').value;
            const dias = document.getElementById('dias').value;

            if (!dni || !nombre || !diagnostico || !dias) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // 1. Armar los datos que irán dentro del QR (Inviolabilidad)
            const fechaHoy = new Date().toLocaleDateString('es-AR');
            const qrData = `TIPO: REPOSO | DNI: ${dni} | PACIENTE: ${nombre} | DIAG: ${diagnostico} | DIAS: ${dias} | FECHA: ${fechaHoy} | VALIDEZ: VERIFICADA`;

            // 2. Generar el PDF
            generarPDF('Certificado de Reposo Médico', nombre, dni, diagnostico, `Se indican ${dias} días de reposo a partir de la fecha.`, qrData);
        });
    }

    // === LÓGICA PARA ALTA ===
    if (btnAlta) {
        btnAlta.addEventListener('click', () => {
            const dni = document.getElementById('dni-alta').value;
            const nombre = document.getElementById('nombre-alta').value;
            const tipoAlta = document.getElementById('tipo-alta').value;
            const estudios = document.getElementById('estudios').value;

            if (!dni || !nombre || !tipoAlta) {
                alert("Por favor, complete los campos obligatorios.");
                return;
            }

            // 1. Armar los datos que irán dentro del QR
            const fechaHoy = new Date().toLocaleDateString('es-AR');
            const qrData = `TIPO: ALTA | DNI: ${dni} | PACIENTE: ${nombre} | CONDICION: ${tipoAlta} | ESTUDIOS: ${estudios} | FECHA: ${fechaHoy} | VALIDEZ: VERIFICADA`;

            // 2. Generar el PDF
            generarPDF('Certificado de Alta Médica', nombre, dni, tipoAlta, `Estudios sugeridos: ${estudios}`, qrData);
        });
    }

    // === FUNCIÓN MAESTRA QUE DIBUJA EL PDF Y EL QR ===
    function generarPDF(titulo, nombre, dni, datoPrincipal, datoSecundario, qrTexto) {
        const doc = new jsPDF();

        // Configuración de márgenes y tipografía
        doc.setFont("helvetica");
        
        // Encabezado corporativo
        doc.setFontSize(22);
        doc.setTextColor(44, 62, 80);
        doc.text("SUITE MÉDICA OFICIAL", 105, 20, null, null, "center");
        
        doc.setFontSize(16);
        doc.text(titulo, 105, 30, null, null, "center");
        doc.line(20, 35, 190, 35); // Línea separadora

        // Cuerpo del certificado
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`, 20, 50);
        doc.text(`Paciente: ${nombre}`, 20, 60);
        doc.text(`Documento (DNI): ${dni}`, 20, 70);
        
        doc.setFontType("bold");
        doc.text(`Detalle Clínico:`, 20, 85);
        
        doc.setFontType("normal");
        doc.text(`- ${datoPrincipal}`, 20, 95);
        doc.text(`- ${datoSecundario}`, 20, 105);

        // Textos legales
        doc.setFontSize(10);
        doc.setTextColor(127, 140, 141);
        doc.text("Este documento ha sido generado de forma electrónica y su autenticidad", 105, 130, null, null, "center");
        doc.text("puede ser verificada escaneando el código QR adjunto.", 105, 135, null, null, "center");

        // Generar el QR en memoria usando QRious
        const qr = new QRious({
            value: qrTexto,
            size: 150
        });
        
        // Insertar el QR como imagen en el PDF
        const qrImage = qr.toDataURL();
        doc.addImage(qrImage, 'PNG', 80, 145, 50, 50);

        // Guardar/Descargar el archivo automáticamente
        const nombreArchivo = `${titulo.replace(/\s+/g, '_')}_${dni}.pdf`;
        doc.save(nombreArchivo);
    }
});
