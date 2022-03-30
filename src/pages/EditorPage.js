import React, { useEffect, useRef, useState } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
    const [clients, setClients] = useState([]);

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();

    const reactNavigator = useNavigate();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on("connect-error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            const handleErrors = (e) => {
                console.log("socket err", e);
                toast.error("Connection failed please try again later.");
                reactNavigator("/")
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            //listening for joined event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`)
                    // console.log(`${username} joined`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,

                })
            })

            //listening for disconnecting event
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setClients((prev) => {
                    return prev.filter(client => client.socketId !== socketId)
                })
            })

        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success("Room ID has been copied to your clipboard");
        } catch (err) {
            toast.error("Couldn't copy the Room ID");
            console.log(err);
        }
    }

    const leaveRoom = () => {
        reactNavigator("/")

    }

    if (!location.state) {
        return <Navigate to="/" />
    }
    return (
        <>
            <div className='mainWrap'>
                <div className="aside">
                    <div className="asideInner">
                        <div className="logo">
                            <img
                                className='logoImage'
                                src="/code-sync.png"
                                alt="logo"
                            />
                        </div>
                        <h3 >Connected</h3>
                        <div className="clientList">
                            {
                                clients.map((client) => (
                                    <Client username={client.username} key={client.socketId} />
                                ))
                            }
                        </div>
                    </div>
                    <button className='btn copyBtn' onClick={copyRoomId}>
                        Copy ROOM ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave
                    </button>
                </div>
                <div className="editorWrap"><Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                    codeRef.current = code;
                }} /></div>
            </div>
            <div className="forMobile">
                <h1>Thank you for visiting</h1>


                <img
                    className='logoImage'
                    src="/code-sync.png"
                    alt="logo"
                />

                <h1>Please open this on a Laptop or Tablet</h1>
            </div>
        </>
    )
}

export default EditorPage