import { useBody } from 'h3';
import { readdirSync, statSync } from 'fs';
import { join, normalize } from 'path';
import { config } from 'dotenv';

config();

const folderRoot = process.env.DATA_PATH ?? "/data/";

export default async (req) => {
    const body = await useBody(req);
    
    //remove trailing slash if any
    if(body.path && body.path.length > 2 && body.path.endsWith('/') ) 
        body.path = body.path.slice(0, -1);

    const path = folderRoot + body.path!='/'? normalize(folderRoot + decodeURI(body.path)):'';
    console.log('path: ' + path);
    const stats = statSync(path);
    if(!stats.isDirectory()){
        return {
            status: 404,
            body: {
                error: 'Not a directory'
            }
        }
    }

    const files = readdirSync(path);
    const filesWithStats = files.map(file => {
        const filePath =  normalize(path + '/'+ file);
        const url = (body.path!='/'? body.path: '') + '/' + file;
        //console.log(filePath + ' : ' + url);
        const stats = statSync(filePath);
        return {
            name: file,
            isDirectory: stats.isDirectory(),
            url: url,
            size: stats.size,
            date: stats.mtime
        }
    });
    const parent = body.path.split("/").slice(0,-1).join("/");
    console.log('body path:' + body.path);
    console.log('parent: '+ parent);
    return {
        files: filesWithStats,
        path: body.path,
        parent: parent!==''? parent: '/',
        pathArray: body.path.split("/")

    };
}

