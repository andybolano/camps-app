export declare class FilesService {
    private readonly logger;
    private readonly uploadsDir;
    constructor();
    saveFile(file: Express.Multer.File, subFolder?: string): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
}
