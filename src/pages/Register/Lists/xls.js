import XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "currency-formatter";

const s2ab = (s) => { 
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;    
}

const typeFormatter = type => {
    if (type === 0) {
        return "Vencedor";
    } else if (type === 1) {
        return "Exatas";
    }

    return "Jogo dos campeões";
};

export const returnString = period => (period < 10 ? '0' + period : period);

export const formatDate = timestamp => {
    const obj = new Date(timestamp);
  
    return `${returnString(obj.getDate())}/${returnString(obj.getMonth() + 1)}/${obj.getFullYear()}`;
};

export const formatTime = timestamp => {
    const obj = new Date(timestamp);
  
    return `${obj.getHours()}:${returnString(obj.getMinutes())}`;
};

const UserHeader = ['Nome', 'Telefone', 'Documento', 'E-mail', 'CheckIn', 'Data', 'Hora'];

export const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
        Title: 'Template de lista',
        Subject: 'Lista de usuários',
        CreatedDate: new Date(),
    };

    workbook.SheetNames.push('Usuários');

    const userData = XLSX.utils.aoa_to_sheet([
        UserHeader
    ]);

    workbook.Sheets['Usuários'] = userData;

    const xls = XLSX.write(workbook, {bookType:'xlsx', type: 'binary'});

    saveAs(new Blob([s2ab(xls)], {type:"application/octet-stream"}), 'template_da_lista.xlsx');
}


export const readXLSFile = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        
        reader.onload = () => {
            const workbook = XLSX.read(reader.result, {
                type: "buffer",
                cellDates: true
            });
            const sheet_name_list = workbook.SheetNames;
            const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

            const data = xlData.map(user => {
                const data = {
                    name: user['Nome'],
                    fone: user['Telefone'],
                    document: user['Documento'],
                    email: user['E-mail'],
                    checkin: Boolean(user['CheckIn']),
                    date: new Date(),
                    time: new Date()
                };

                if (user['CheckIn']) {
                    const time = new Date();
        
                    time.setHours(user['Hora'].split(/:/g)[0]);
                    time.setMinutes(user['Hora'].split(/:/g)[1]);

                    data.date = new Date(user['Data'].split(/\//g).reverse());
                    data.time = time;
                }

                return data
            })

            resolve(data);
        };
        
        reader.onerror = reject
    })
}

export const exportData = (name, list) => {
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
        Title: name,
        Subject: 'Lista de usuários',
        CreatedDate: new Date(),
    };

    workbook.SheetNames.push('Lista de usuários');

    const userData = XLSX.utils.aoa_to_sheet([
        UserHeader,
        ...list.map(item => [
            item.name,
            item.fone,
            item.document,
            item.email,
            item.checkin,
            item.checkin ? formatDate(new Date(item.date).getTime()) : '',
            item.checkin ? !new Date(item.time).getTime() ? item.time.slice(0, -3) : formatTime(new Date(item.time).getTime()) : ''
        ])
    ]);

    workbook.Sheets['Lista de usuários'] = userData;

    const xls = XLSX.write(workbook, {bookType:'xlsx', type: 'binary'});

    saveAs(new Blob([s2ab(xls)], {type:"application/octet-stream"}), 'lista_de_usuários_'+name+'.xlsx');
}