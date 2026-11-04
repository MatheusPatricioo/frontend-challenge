import { Tag } from 'antd';

import { EyeInvisibleOutlined, UserOutlined } from '@ant-design/icons';

type Props = { isAnonymous: boolean };

export function AnonymityTag({ isAnonymous }: Props) {
    if (isAnonymous)
        return <Tag icon={<EyeInvisibleOutlined />}>Anônimo</Tag>;

    return <Tag color="green" icon={<UserOutlined />}>Identificado</Tag>;
}