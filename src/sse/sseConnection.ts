import { createSession, Session } from "better-sse";
import { v4 as uuidv4 } from 'uuid';

interface SSESession
{
    session: Session;
    req: any;
    res: any;
}

export class SSEConnectionHandler
{
    static _instance: SSEConnectionHandler;
    private clients: Map<string, SSESession> = new Map();

    private constructor() { }

    public static getInstance(): SSEConnectionHandler {
        if (!SSEConnectionHandler._instance) {
            SSEConnectionHandler._instance = new SSEConnectionHandler();
        }

        return SSEConnectionHandler._instance;
    }

    public createConnection()
    {
        return async (req: any, res: any) => 
        {
            let clientId = uuidv4();

            let session: SSESession = {
                session:  await createSession(req, res),
                req,
                res
            }

            this.clients.set(clientId, session);
        
            this.clients.get(clientId)!.session.push({clientId: clientId});

            this.clients.get(clientId)!.res.socket.on('close', () => {
                this.closeConnection(clientId);
            });
        }
    }

    public checkConnection(clientId: string): boolean
    {
        if(this.clients.get(clientId)?.session.isConnected) return true;
        
        return false; 
    }

    public sendEvent(clientId: string, message: any)
    {
        if(this.clients.get(clientId))
        {
            this.clients.get(clientId)?.session.push(message);
        }
    }

    public closeConnection(clientId: string)
    {
        if(this.clients.get(clientId)) 
        {
            if(this.clients.get(clientId)!.session.isConnected) this.clients.get(clientId)!.session.push({close: true});
            this.clients.get(clientId)!.res.end();
            this.clients.delete(clientId);
        }
    }
}