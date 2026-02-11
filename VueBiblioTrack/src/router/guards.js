import { useAuthStore } from "@/stores/authStore";
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

export const requireAuth = ()=> {
    const authStore = useAuthStore();
    if(!authStore.isAuthenticated) {
        return { name: APP_ROUTE_NAMES.SIGN_IN  };
    }
    return true;
}
export const requireAdmin = ()=> {
    const authStore = useAuthStore();
    if(!authStore.isAuthenticated) {
        return { name: APP_ROUTE_NAMES.SIGN_IN  };
    }
    if(!authStore.isAdmin) {
        return { name: APP_ROUTE_NAMES.NO_ACCESSS  };
    } 
    return true;
}