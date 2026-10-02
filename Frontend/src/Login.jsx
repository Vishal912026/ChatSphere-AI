import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import server from "./environment";

const REQUEST_TIMEOUT_MS = 70000;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(server.prod, { method: "GET", mode: "no-cors" }).catch(() => {});
    }, []);

    useEffect(() => {
        if (!loading) return;
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [loading]);

    let infoMessage = "";
    if (loading) {
        if (seconds >= 20) {
            infoMessage = "Almost there… the server is starting up. Please don't close or refresh this page.";
        } else if (seconds >= 4) {
            infoMessage = "Our server is waking up (free hosting). The first login can take up to 30–40 seconds. Please stay on this page — you'll be signed in automatically.";
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        setSeconds(0);
        setLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(`${server.prod}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                signal: controller.signal
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.removeItem("currThreadId");
            localStorage.setItem("userName", data.name);
            navigate("/");
        } catch (err) {
            console.log(err);
            if (err.name === "AbortError") {
                setError("The server is taking longer than usual. Please try again in a minute.");
            } else {
                setError("Could not connect to the server. Please try again in a few seconds.");
            }
        } finally {
            clearTimeout(timeoutId);
            setLoading(false);
        }
    };

    return (
        <div className="authContainer">
            <form className="authBox" onSubmit={handleLogin}>
                <h2>Login to ChatSphere AI</h2>
                {error && <p className="authError">{error}</p>}
                {loading && infoMessage && (
                    <div className="authInfo" role="status" aria-live="polite">{infoMessage}</div>
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                <button type="submit" disabled={loading}>
                    {loading ? (<><span className="authSpinner" /> Logging in…</>) : "Login"}
                </button>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
}

export default Login;