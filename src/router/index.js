import {createRouter, createWebHashHistory} from "vue-router"
import HomeView from "@/view/HomeView.vue";
import ContactView from "@/view/ContactView.vue";
import ResumeView from "@/view/ResumeView.vue";
import SkillsView from "@/view/SkillsView.vue";
import ProjectsView from "@/view/ProjectsView.vue";
import AerialClassificationView from "@/view/project/AerialClassificationView.vue";
import CryptographyView from "@/view/project/CryptographyView.vue";
import GameView from "@/view/project/GameView.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView
    },
    {
        path: "/resume",
        name: "Resume",
        component: ResumeView
    },
    {
        path: "/contact",
        name: "Contact",
        component: ContactView
    },
    {
        path: "/skills",
        name: "Skills",
        component: SkillsView
    },
    {
        path: "/projects",
        name: "Projects",
        component: ProjectsView
    },
    {
        path: "/projects/aerial",
        name: "AerialClassification",
        component: AerialClassificationView
    },
    {
        path: "/projects/game",
        name: "Game",
        component: GameView
    },
    {
        path: "/projects/cryptography",
        name: "Cryptography",
        component: CryptographyView
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;