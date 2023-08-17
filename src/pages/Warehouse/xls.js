import XLSX from "xlsx";
import { saveAs } from "file-saver";

const s2ab = (s) => { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

export const returnString = period => (period < 10 ? '0' + period : period);

export const formatDate = timestamp => {
    const obj = new Date(timestamp);
  
    return `${returnString(obj.getDate())}/${returnString(obj.getMonth() + 1)}/${obj.getFullYear()}`;
};

export const formatTime = timestamp => {
    const obj = new Date(timestamp);
  
    return `${obj.getHours()}:${returnString(obj.getMinutes())}`;
};

const ProductHeader = ['Nome', 'Grupo', 'Tipo', 'Quantidade', 'Custo unitário', 'Custo total'];

export const exportData = (name, list = []) => {
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
        Title: name,
        Subject: 'Lista de produtos',
        CreatedDate: new Date(),
    };

    workbook.SheetNames.push('Lista de produtos');

    const productData = XLSX.utils.aoa_to_sheet([
        ProductHeader,
        ...list.map(item => [
            item.product_name,
            item.group_name,
            item.type,
            item.quantity,
            item.unit,
            item.total
        ])
    ]);

    workbook.Sheets['Lista de produtos'] = productData;

    const xls = XLSX.write(workbook, {bookType:'xlsx', type: 'binary'});

    saveAs(new Blob([s2ab(xls)], {type:"application/octet-stream"}), 'estoque_'+name+'.xlsx');
}

// export const readXLSFile = file => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(file);
        
//         reader.onload = () => {
//             const workbook = XLSX.read(reader.result, {
//                 type: "buffer",
//                 cellDates: true
//             });
//             const sheet_name_list = workbook.SheetNames;
//             const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

//             const data = xlData.map(user => {
//                 const data = {
//                     name: user['Nome'],
//                     fone: user['Telefone'],
//                     document: user['Documento'],
//                     email: user['E-mail'],
//                     checkin: Boolean(user['CheckIn']),
//                     date: new Date(),
//                     time: new Date()
//                 };

//                 if (user['CheckIn']) {
//                     const time = new Date();
        
//                     time.setHours(user['Hora'].split(/:/g)[0]);
//                     time.setMinutes(user['Hora'].split(/:/g)[1]);

//                     data.date = new Date(user['Data'].split(/\//g).reverse());
//                     data.time = time;
//                 }

//                 return data
//             })

//             resolve(data);
//         };
        
//         reader.onerror = reject
//     })
// }