import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PlanForm from "./features/plans/PlanForm";
import PlanList from "./features/plans/PlanList";
import PlanDetail from "./features/plans/PlanDetail";
import PlanEditForm from "./features/plans/PlanEditForm";
import CreateGroups from "./features/groups/CreateGroups";
import GroupList from "./features/groups/GroupList";
import Layout from "./components/Layout";
import JoinGroup from "./features/groups/JoinGroup";
import GroupDetail from "./features/groups/GroupDetail";
import Vote from "./features/votes/Vote";
import Deadline from "./features/votes/Deadline";
import VoteRanking from "./features/votes/VoteRanking";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Layoutで包むグループ */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/plans/:id" element={<PlanDetail />} />
            <Route path="/plans/:id/edit" element={<PlanEditForm />} />
            <Route path="/creategroup" element={<CreateGroups />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/groups/:groupId/plans" element={<PlanList />} />
            <Route path="/groups/:groupId/plans/new" element={<PlanForm />} />
            <Route
              path="/groups/:groupId/plans/:planId/edit"
              element={<PlanEditForm />}
            />
            <Route path="/groups/join" element={<JoinGroup />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
            <Route path="/groups/:groupId/vote" element={<Vote />} />
            <Route path="/groups/:groupId/deadline" element={<Deadline />} />
            <Route
              path="/groups/:groupId/voteRanking"
              element={<VoteRanking />}
            />
            <Route
              path="/groups/:groupId/vote/ranking"
              element={<VoteRanking />}
            />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
