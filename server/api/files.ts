import { useBody } from 'h3';
import { readdirSync, statSync } from 'fs';
import { join, normalize } from 'path';
import { config } from 'dotenv';

config();

const folderRoot = process.env.DATA_PATH ?? "/data/";

export default async (req,res) => {

    const body = await useBody(req);
    
    if(!body) return { status: 400, body: "No body" };
    if(!body.path) return { status: 400, body: "No path" };
    
    //remove trailing slash if any
    if(body.path && body.path.length > 2 && body.path.endsWith('/') ) 
        body.path = body.path.slice(0, -1);

    const path = folderRoot + body.path!='/'? normalize(folderRoot + decodeURI(body.path)):'';
    try {
        const stats = statSync(path);
        if(!stats || !stats.isDirectory()){
            throw new Error('Not a directory');
        }
    }
    catch(e){
        console.log('not found: ' + path);
        res.statusCode = 404;
        return res.end("Not found");
    }
    console.log('path: ' + path);
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
    
    const fileandStatsOrdered = filesWithStats.sort((a,b) => {
        if(a.isDirectory && !b.isDirectory) return -1;
        if(!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
    });

    const parent = body.path.split("/").slice(0,-1).join("/");
    console.log('body path:' + body.path);
    console.log('parent: '+ parent);
    return {
        files: fileandStatsOrdered,
        path: body.path,
        parent: parent!==''? parent: '/',
        pathArray: body.path.split("/")
    };
}

