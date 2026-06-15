import { c_tr, type p_tr } from '@loftyshaky/shared/shared';

// Instead of extending, just use BaseTr directly with custom props
export const Tr = (props: p_tr.BaseTr) => {
    // Add your custom logic here
    return <c_tr.BaseTr {...props} />;
};
