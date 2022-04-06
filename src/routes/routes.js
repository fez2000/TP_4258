const DashboardLayout = () => import("@/pages/Layout/DashboardLayout.vue");

const Dashboard = () => import("@/pages/Dashboard.vue");
const DashboardPost = () => import("@/pages/DashboardPost.vue");
const UserProfile = () => import("@/pages/UserProfile.vue");
const Notifications =  () => import("@/pages/Notifications.vue");
const Landing = () => import("@/views/Landing.vue");
const Signup = () => import("@/views/Signup.vue");
const Login = () => import("@/views/Login.vue");
const Profil = () => import("@/views/Profil.vue");
const MainNavbar = () => import("@/layout/MainNavbar.vue");
const MainFooter = () => import("@/layout/MainFooter.vue");
const Projects =  () => import("@/pages/Projects.vue");
const CreateProject = () => import("@/pages/CreateProject.vue");
const Contribute = () => import("@/pages/Contribute.vue");
const ManageUsers = () => import("@/pages/ManageUsers.vue");
const ManageProjects = () => import("@/pages/ManageProjects.vue");
const VoterProfile = () => import("@/pages/VoterProfile.vue");
const P404 = () => import("@/pages/P404.vue");
const AllProjects = () => import("@/pages/AllProjects.vue");
const CurrentProjects = () => import("@/pages/CurrentProjects.vue");
const FinishedProjects = () => import("@/pages/FinishedProjects.vue");
const FutureProjects = () => import("@/pages/FutureProjects.vue");
const TermsCookies = () => import("@/pages/TermsCookies.vue");
const TermsPrivacyPolicy = () => import("@/pages/TermsPrivacyPolicy.vue");
const TermsComunity = () => import("@/pages/TermsComunity.vue");
const TermsLayout = () => import("@/pages/Layout/TermsLayout.vue");
const VerifyEmail = () => import("@/pages/VerifyEmail.vue");
const EmailVerificationStatus = () => import("@/pages/EmailVerificationStatus.vue");
const ResetPassword = () => import("@/views/ResetPassword.vue");
const DashboardVoterProfil = () => import("@/pages/DashboardVoterProfil.vue");
const ProjectsLayout = () => import("@/pages/Layout/ProjectsLayout.vue");
const ProjectProfil = () => import("@/pages/ProjectProfil.vue");
const NetworkError = () => import("@/pages/NetworkError.vue");
const DashboardProjectProfil = () => import("@/pages/DashboardProjectProfil.vue");
const Settings = () => import("@/pages/Settings.vue");
const Members = () => import("@/views/Members.vue");
const MeProfil = () => import("@/pages/MeProfil.vue");
const MeProfilPublic = () => import("@/views/MeProfilPublic.vue");
import i18n from "@/plugins/i18n";
const AdminPanel = () => import("@/pages/Layout/AdminPanel.vue");
const PendingProject = () => import("@/pages/PendingProject.vue");
const MyProjectsState = () => import("@/pages/MyProjectsState.vue");
const ProjectsInProcess = () => import("@/pages/ProjectsInProcess.vue");
const Poll = () => import("@/pages/Poll.vue");
const CreatePoll = () => import("@/pages/CreatePoll.vue");
const LoginApi = () => import("@/pages/LoginApi.vue");
const Help = () => import("@/pages/Help.vue");
const Files = () => import("@/pages/Files.vue");

const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/verifyemail",
        name: "Verify Email",
        component: VerifyEmail
    },
    {
        path: "/home",
        name: "Home",
        components: {
            default: Landing,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/signup",
        name: "signup",
        components: {
            default: Signup,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/members",
        name: "Members",
        components: {
            default: Members,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/api/auth/linkedin",
        name: "linkedin login",
        component: LoginApi
    },
    {
        path: "/login",
        name: "login",
        components: {
            default: Login,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/resetpassword",
        name: "Reset Password",
        components: {
            default: ResetPassword,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/emailverificationstatus",
        name: "Email Verification Status",
        component: EmailVerificationStatus
    },
    {
        path: "/me",
        name: "profil",
        components: {
            default: MeProfilPublic,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/in/:url",
        name: "any profil",
        components: { default: Profil, header: MainNavbar, footer: MainFooter },
        props: {
            header: { colorOnScroll: 400 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/terms",
        component: TermsLayout,
        children: [
            {
                path: "privacypolicy",
                component: TermsPrivacyPolicy,
                name: "Terms privacy policy"
            },
            {
                path: "comunity",
                component: TermsComunity,
                name: "Terms comunity"
            },
            {
                path: "cookies",
                component: TermsCookies,
                name: "Terms cookies"
            },
            {
                path: "",
                redirect: "/terms/comunity"
            }
        ]
    },
    {
        path: "/dashboard",
        components: { default: DashboardLayout },
        children: [
            {
                path: "",
                name: i18n.tc("dashboardL.dashboard"),
                component: Dashboard
            },
            {
                path: "help",
                name: "Help",
                component: Help
            },
            {
                path: "file",
                name: "Documents",
                component: Files,
            },
            {
                path: "forum",
                name: "Forum",
                component: DashboardPost
            },
            {
                path: "projects/inprocess",
                name: "Project de la comunaute",
                component: ProjectsInProcess
            },
            {
                path: "me",
                name: "My Profil",
                component: MeProfil
            },
            {
                path: "admin",
                component: AdminPanel,
                children: [
                    {
                        path: "users",
                        name: i18n.tc("dashboardL.manage_users"),
                        component: ManageUsers
                    },
                    {
                        path: "projects/submit",
                        name: i18n.tc("dashboardL.manage_projets"),
                        component: ManageProjects
                    },
                    {
                        path: "projects/pending",
                        name: "Projects en attente",
                        component: PendingProject
                    },
                    {
                        path: "poll/create",
                        name: "Creer un vote",
                        component: CreatePoll
                    },
                    {
                        path: "poll",
                        name: "Vote",
                        component: Poll
                    }
                ]
            },
            {
                path: "user",
                name: "User Profile",
                component: UserProfile
            },
            {
                path: "profil",
                name: "Public Profil of",
                component: VoterProfile
            },
            {
                path: "in/:url",
                name: "Member Profil",
                component: DashboardVoterProfil
            },
            {
                path: "projects",
                name: i18n.tc("dashboardL.projects"),
                component: Projects
            },
            {
                path: "projects/state",
                name: "Projects soumis",
                component: MyProjectsState
            },
            {
                path: "project/:url",
                name: i18n.tc("createproject.project_overview"),
                component: DashboardProjectProfil
            },
            {
                path: "projects/create",
                name: i18n.tc("createproject.title"),
                component: CreateProject
            },
            {
                path: "notifications",
                name: "Notifications",
                component: Notifications
            },
            {
                path: "settings",
                name: "Settings",
                component: Settings
            },
            {
                path: "contribute",
                name: i18n.tc("dashboardL.contribute"),
                component: Contribute
            },
            {
                path: "*",
                name: "Page Not Found",
                component: P404
            }
        ],
        scrollBehavior: to => {
            if (to.hash) {
                return { selector: to.hash };
            }
            return { x: 0, y: 0 };
        }
    },
    {
        path: "/projects",
        children: [
            {
                path: "future",
                name: "Future Projects",
                component: FutureProjects
            },
            {
                path: "current",
                name: "Current Projects",
                component: CurrentProjects
            },

            {
                path: "finished",
                name: "Finished Projects",
                component: FinishedProjects
            },
            {
                path: "",
                name: "All Projects",
                component: AllProjects
            }
        ],
        components: {
            default: ProjectsLayout,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 }
        }
    },
    {
        path: "/project/:url",
        name: "Project evolution",
        components: {
            default: ProjectProfil,
            header: MainNavbar,
            footer: MainFooter
        },
        props: {
            header: { colorOnScroll: 50 },
            footer: { backgroundColor: "black" }
        }
    },
    {
        path: "/networkerror",
        name: "Network Error",
        component: NetworkError
    },
    {
        path: "*",
        name: "404",
        components: { default: P404 }
    }
];

export default routes;
