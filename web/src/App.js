import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthContext, AuthGuard} from "./context/AuthContext";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Navbar from "./components/navbar/Navbar";
import {ProjectProvider} from "./components/projects/ProjectContext";
import Home from "./components/home/Home";
import Projects from "./components/projects/Projects";
import ProjectMenu from "./components/menu/ProjectMenu";
import SettingsMenu from "./components/menu/SettingsMenu";
import Settings from "./components/settings/Settings";
import {SprintProvider} from "./components/projects/sprints/SprintContext";
import {StoryProvider} from "./components/projects/sprints/stories/StoryContext";
import {useContext, useEffect, useState} from "react";
import {WsProvider} from "cerberus-reactjs";

function App() {
    const authCtx = useContext(AuthContext)
    const [socketUrl, setSocketUrl] = useState("")

    useEffect(() => {
        if (authCtx.user != null) {
            setSocketUrl(`ws://localhost:9000/api/token/${authCtx.user.cerberusToken}`) // TODO don't use query param for token
        }
    }, [authCtx])

  return (
      <BrowserRouter>
          <WsProvider socketUrl={socketUrl}>
          <ProjectProvider>
              <SprintProvider>
                  <StoryProvider>
                      <div className="grid-container">
                          <div className="grid-header">
                              <header>
                                  <Navbar/>
                              </header>
                          </div>
                          <div className="grid-menu">
                              <Routes>
                                  <Route path="/projects/:id/*" element={<AuthGuard><ProjectMenu/></AuthGuard>}/>
                                  <Route path="/settings/*" element={<AuthGuard><SettingsMenu/></AuthGuard>}/>
                              </Routes>
                          </div>
                          <div className="grid-main">
                              <main className="container">
                                      <Routes>
                                          <Route path="/settings/*" element={<AuthGuard redirectTo="/login"><Settings/></AuthGuard>}/>
                                          <Route path="/projects/*" element={<AuthGuard redirectTo="/login"><Projects/></AuthGuard>}/>
                                          <Route exact path="/" element={<AuthGuard redirectTo="/login"><Home/></AuthGuard>}/>
                                          <Route exact path="/login" element={<Login/>}/>
                                          <Route exact path="/register" element={<Register/>}/>
                                      </Routes>
                              </main>
                          </div>
                          <div className="grid-footer">
                              <footer>
                              </footer>
                          </div>
                      </div>
                  </StoryProvider>
              </SprintProvider>
          </ProjectProvider>
          </WsProvider>
      </BrowserRouter>
  );
}

export default App;
