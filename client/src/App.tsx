import { RouterProvider } from 'react-router';

import { App as AntdAppProvider, ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import { router } from './router';

dayjs.locale('pt-br');

/** @see https://ant.design/components/overview/ */
export function App() {
    return (
        <ConfigProvider locale={ptBR}>
            <AntdAppProvider>
                <RouterProvider router={router} />
            </AntdAppProvider>
        </ConfigProvider>
    );
}