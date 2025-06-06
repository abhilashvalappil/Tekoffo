import { Briefcase, ClipboardList, FileText, LayoutDashboard, MessageSquare, ScrollText } from "lucide-react";


export const clientNavItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Overview', id: 'overview', path: '/client-dashboard' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Post a Job', id: 'post', path: '/client/post-job' },
    { icon: <ClipboardList className="h-5 w-5" />, label: 'My Job Posts', id: 'my-jobs', path: '/client/myjobs' },
    // { icon: <Users className="h-5 w-5" />, label: 'Talent', id: 'talent', path: '/client/freelancers'  },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Freelancer Gigs', id: 'gigs', path: '/client/freelancer-gigs' },
    { icon: <FileText className="h-5 w-5" />, label: 'Proposals', id: 'proposals', path: '/client/proposals' },
    { icon: <ScrollText className="h-5 w-5" />, label: 'Contracts', id: 'contracts', path: '/client/contracts' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', id: 'messages', path: '/messages' },
  ];