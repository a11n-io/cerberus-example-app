import {BrowserRouter, Routes, Route} from "react-router-dom";
import {AuthGuard} from "./context/AuthContext";
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

function App() {

  return (
      <BrowserRouter>
          <ProjectProvider>
              <SprintProvider>
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
              </SprintProvider>
          </ProjectProvider>
      </BrowserRouter>
  );
}

export default App;
