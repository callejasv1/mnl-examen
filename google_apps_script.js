/**
 * MAKE NOISE LAB — SCRIPT DE RESPALDO AUTOMÁTICO EN GOOGLE SHEETS
 * 
 * Este script recibe las evaluaciones de los alumnos y las escribe en Google Sheets.
 */

// Prueba manual: Puedes seleccionar esta función arriba y presionar "Ejecutar"
// para autorizar los permisos de tu cuenta de Google por única vez.
function testAutorizacion() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  Logger.log("Conexión exitosa a la hoja: " + sheet.getName());
}

// Responde a peticiones GET (para verificar que el Webhook está online)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "online", "service": "Make Noise Lab Exam Webhook" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Recibe las evaluaciones de los alumnos vía POST
function doPost(e) {
  // Lock para evitar colisiones si varios alumnos envían al mismo segundo
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Si la hoja está vacía, agregar encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora",
        "Nombre Alumno",
        "WhatsApp",
        "Email",
        "Puntaje Técnico",
        "Total Posible",
        "Porcentaje",
        "Estado",
        "Respuestas JSON"
      ]);
    }
    
    // Insertar nueva fila con la evaluación del alumno
    sheet.appendRow([
      data.fecha || new Date().toLocaleString("es-CL"),
      data.nombre || "",
      data.whatsapp || "",
      data.email || "",
      data.puntaje !== undefined ? data.puntaje : 0,
      data.total !== undefined ? data.total : 11,
      data.porcentaje || "0%",
      data.estado || "PENDIENTE",
      data.respuestas_json || "{}"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Evaluación guardada" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
