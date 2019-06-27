    // var JSZip = require('jszip');
    const docx = require("docx")
    var FileSaver = require('file-saver');

    var Docxtemplater = require('docxtemplater');
    const {BorderStyle , WidthType, Document, Paragraph, Packer,TextRun, Table } = docx;
    var fs = require('fs');
    var path = require('path');

    var btnexport = document.getElementById("btn-export");
    console.log(btnexport)

    btnexport.addEventListener("click", generate)

    function generate(data) {
        console.log("genarating report")
        const doc = new Document();

        doc.createImage(fs.readFileSync("./assets/img/kop.png"), 600, 130);

        const tableHead = doc.createTable({
            rows: 6,
            columns: 3,
        });

        var cell00 = tableHead.getCell(0, 0).addParagraph(new Paragraph("Nama pegawai  "));
            border_none(cell00)
        var cell10 = tableHead.getCell(1, 0).addParagraph(new Paragraph("NIP pegawai"))
            border_none(cell10)
        var cell20 = tableHead.getCell(2, 0).addParagraph(new Paragraph("Subagan"))
            border_none(cell20)
        var cell30 = tableHead.getCell(3, 0).addParagraph(new Paragraph("Keperluan"))
            border_none(cell30)
        var cell40 = tableHead.getCell(4, 0).addParagraph(new Paragraph("Jam Keluar"))
            border_none(cell40)
        var cell40 = tableHead.getCell(5, 0).addParagraph(new Paragraph("Jam Masuk"))
            border_none(cell40)

        var cell01 = tableHead.getCell(0, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell01)
        var cell11 = tableHead.getCell(1, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell11)
        var cell21 = tableHead.getCell(2, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell21)
        var cell31 = tableHead.getCell(3, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell31)
        var cell41 = tableHead.getCell(4, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell41)
        var cell51 = tableHead.getCell(5, 1).addParagraph(new Paragraph("  :  "))
            border_none(cell51)

        var cell02 = tableHead.getCell(0, 2).addParagraph(new Paragraph("  "+data.nama_pegawai))
            border_none(cell02)
        var cell12 = tableHead.getCell(1, 2).addParagraph(new Paragraph("  "+data.nip_pegawai))
            border_none(cell12)
        var cell22 = tableHead.getCell(2, 2).addParagraph(new Paragraph("  "+data.nama))
            border_none(cell22)
        var cell32 = tableHead.getCell(3, 2).addParagraph(new Paragraph("  "+data.bon_keterangan))
            border_none(cell32)
        var cell42 = tableHead.getCell(4, 2).addParagraph(new Paragraph("  "+data.bon_jam_keluar))
            border_none(cell42)
        var cell52 = tableHead.getCell(5, 2).addParagraph(new Paragraph("  "+data.bon_jam_masuk))
            border_none(cell52)


        for(var k = 0; k < 2; k++){
            var paragraph = new Paragraph("");
            doc.addParagraph(paragraph);
        }

        var paragraph = new Paragraph("Detail bon nara pidana");
        doc.addParagraph(paragraph);
       
        const table = doc.createTable({
            rows: (data.item.length + 1),
            columns: 4,
        });

        table.getCell(0, 0).addParagraph(new Paragraph("Napi Id"));
        table.getCell(0, 1).addParagraph(new Paragraph("Nomor Registrasi Napi"));
        table.getCell(0, 2).addParagraph(new Paragraph("Nama"));
        table.getCell(0, 3).addParagraph(new Paragraph("blok / Kamar"));


        for(var k = 0; k < data.item.length; k++){
            table.getCell( k, 0 )
                .addParagraph(new Paragraph(data.item.napi_id))
                .Properties.setWidth("25%", WidthType.PCT);
            table.getCell( k, 1 )
                .addParagraph(new Paragraph(data.item.napi_no_reg))
                .Properties.setWidth("25%", WidthType.PCT);
            table.getCell( k, 2 )
                .addParagraph(new Paragraph(data.item.napi_nama))
                .Properties.setWidth("25%", WidthType.PCT);
            table.getCell( k, 3 )
                .addParagraph(new Paragraph(data.item.blok_nama))
                .Properties.setWidth("25%", WidthType.PCT);
            
        }


        const packer = new Packer();

        var today = new Date();

        packer.toBlob(doc).then(blob => {
            console.log(blob);
            FileSaver.saveAs(blob, `${data.nama_pegawai}_${data.nip_pegawai}_${data.nama}_${today}.docx`);
            console.log("Document created successfully");
        });
    }

    function border_none(cell) {
        cell.Borders.addStartBorder(BorderStyle.DOT_DOT_DASH, 0, "white");
        cell.Borders.addTopBorder(BorderStyle.DOT_DOT_DASH, 0, "white");
        cell.Borders.addBottomBorder(BorderStyle.DOT_DOT_DASH, 0, "white");
        cell.Borders.addEndBorder(BorderStyle.DOT_DOT_DASH, 0, "white");
    }

    module.exports = {
        export_docx : function (data) {
            console.log(data)
            generate(data)
        }
    }