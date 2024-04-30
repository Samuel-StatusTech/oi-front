import React from "react"

import Home, { Icon as HomeIcon } from "../pages/Home"
import Warehouse, { Icon as WarehouseIcon } from "../pages/Warehouse"

/*              PRODUTOS                */
import ProductList, { Icon as ProductIcon } from "../pages/Product"
import ProductSimpleForm from "../pages/Product/form/simple"
import ProductComboForm from "../pages/Product/form/combo"
import ProductComplementForm from "../pages/Product/form/complement"
/*              PRODUTOS                */

/*              CADASTRO                */
import { Icon as RegisterIcon } from "../pages/Register/Icon"
import EventList from "../pages/Register/Event"
import EventForm from "../pages/Register/Event/form"
import ManagerList from "../pages/Register/Manager"
import ManagerForm from "../pages/Register/Manager/form"
import GroupList from "../pages/Register/Group"
import GroupForm from "../pages/Register/Group/form"
import OperatorList from "../pages/Register/Operator"
import OperatorForm from "../pages/Register/Operator/form"
import WaiterList from "../pages/Register/Waiter"
import WaiterForm from "../pages/Register/Waiter/form"
import ValidatorList from "../pages/Register/Validator"
import ValidatorForm from "../pages/Register/Validator/form"
import ListsList from "../pages/Register/Lists"
import ListsData from "../pages/Register/Lists/data"
import PDVList from "../pages/Register/PDV"
import PDVForm from "../pages/Register/PDV/form"
import DeviceList from "../pages/Register/Device"
import DeviceForm from "../pages/Register/Device/form"
import ReservationList from "../pages/Register/Reservation"
import ReservationForm from "../pages/Register/Reservation/form"
/*              CADASTRO                */

/*              VENDA ONLINE                */
import { Icon as OnlineIcon } from "../pages/Online/Icon"
import OnlineEventList from "../pages/Online/Event"
import WSOverview from "../pages/WebStore/Overview"
import WSSettings from "../pages/WebStore/Settings"
import WSStatement from "../pages/WebStore/Statement"
import OnlineEventForm from "../pages/Online/Event/form"
import OnlineProductList from "../pages/Online/Product"
import OnlineProductForm from "../pages/Online/Product/form"
/*              VENDA ONLINE                */

/*              GERENCIAL                */
import { Icon as ManagerIcon } from "../pages/Manager/Icon"
import TransactionList from "../pages/Manager/Transaction"
import TransactionProductList from "../pages/Manager/Transaction/productList"
import TransactionProductsList from "../pages/Manager/TransactionProduct"
import TransactionExchangeList from "../pages/Manager/TransactionExchange"
import CancelList from "../pages/Manager/Cancel"
import CancelProductList from "../pages/Manager/Cancel/productList"
import CancelBatch from "../pages/Manager/Cancel/batch"
import CashlessList from "../pages/Manager/Cashless"
import SyncList from "../pages/Manager/Sync"
import AdjustmentList from "../pages/Manager/Adjustment"
import AdjustmentEdit from "../pages/Manager/Adjustment/edit"
import ReconcileData from "../pages/Manager/ReconcileData"
/*              GERENCIAL                */

/*              RELATORIOS                */
import { Icon as ReportIcon } from "../pages/Reports/Icon"
import SalesReport from "../pages/Reports/Sales"
import TaxesReport from "../pages/Reports/Taxes"
import CashlessReport from "../pages/Reports/Cashless"
import ValidationReport from "../pages/Reports/Validation"
import WaiterReport from "../pages/Reports/Waiters"
import ReservationReport from "../pages/Reports/Reservations"
import ListReport from "../pages/Reports/Lists"
/*              EXTRATO FINANCEIRO */
import { Icon as FinancialIcon } from "../pages/FinancialStatement/Icon"
import FinancialStatement from "../pages/FinancialStatement"
/*              RELATORIOS                */

/*              CONFIGURAÇÕES                */
import Orgs, { Icon as OrgsIcon } from "../pages/Settings/Orgs"
import OrgForm from "../pages/Settings/Orgs/form"
import Profile from "../pages/Settings/Profile/form"
import ModalCheck from "../components/Modals/CheckDivergencies"
/*              CONFIGURAÇÕES                */

const EmBreve = () => {
  return (
    <div>
      <spam>
        Esta tela estará disponível <b>Em Breve</b>
      </spam>
    </div>
  )
}

export default [
  {
    title: "Resumo Geral",
    path: "/home",
    icon: HomeIcon,
    content: <Home />,
    paths: [
      {
        title: "Resumo Geral",
        route: "/home",
      },
    ],
  },
  {
    title: "Relatórios",
    icon: ReportIcon,
    list: [
      {
        title: "Vendas",
        path: "/report/sales",
        content: <SalesReport />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Vendas",
            route: "/sales",
          },
        ],
      },
      {
        title: "Extrato Financeiro",
        path: "/report/financial",
        content: <FinancialStatement />,
        role: "master",
        allow: {
          allow_only_master: true,
        },
        show: {
          role: "master",
        },
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Resumo geral",
            route: "/financial",
          },
        ],
      },
      /*
      {
        title: "Cashless",
        path: "/report/cashless",
        //content: <CashlessReport />,
        content: <EmBreve />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Cashless",
            route: "/cashless",
          },
        ],
      }, */
      {
        title: "Validações",
        path: "/report/validation",
        content: <ValidationReport />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Validações",
            route: "/validation",
          },
        ],
      },
      /*
      {
        title: "Garçons",
        path: "/report/waiter",
        //content: <WaiterReport />,
        content: <EmBreve />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Garçons",
            route: "/waiter",
          },
        ],
      },
      {
        title: "Mesas",
        path: "/report/reservation",
        //content: <ReservationReport />,
        content: <EmBreve />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Mesas",
            route: "/reservation",
          },
        ],
      },
      {
        title: "Listas",
        path: "/report/list",
        //content: <ListReport />,
        content: <EmBreve />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Listas",
            route: "/list",
          },
        ],
      },
      {
        title: "Taxas de serviço",
        path: "/report/taxes",
        content: <TaxesReport />,
        paths: [
          {
            title: "Relatórios",
            route: "/report",
          },
          {
            title: "Taxas de serviço",
            route: "/sales",
          },
        ],
      },
      */
    ],
  },
  {
    title: "Cadastros",
    icon: RegisterIcon,
    list: [
      {
        title: "Eventos",
        path: "/event",
        content: <EventList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Eventos",
            route: "/event",
          },
        ],
      },
      {
        path: "/event/:idEvent",
        hide: true,
        content: <EventForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Eventos",
            route: "/event",
          },
        ],
      },
      {
        title: "Gerentes",
        path: "/manager",
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        content: <ManagerList />,
        paths: [
          {
            title: "Gerentes",
            route: "/manager",
          },
        ],
      },
      {
        path: "/manager/:idManager",
        hide: true,
        content: <ManagerForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Gerentes",
            route: "/manager",
          },
        ],
      },
      {
        title: "Grupos",
        path: "/group",
        content: <GroupList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Grupos",
            route: "/group",
          },
        ],
      },
      {
        title: "Produtos",
        path: "/product",
        icon: ProductIcon,
        content: <ProductList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Produtos",
            route: "/product",
          },
        ],
      },
      {
        title: "Estoques",
        path: "/warehouse",
        icon: WarehouseIcon,
        content: <Warehouse />,
        paths: [
          {
            title: "Estoques",
            route: "/warehouse",
          },
        ],
      },
      {
        path: "/product/simple/:idProduct",
        hide: true,
        content: <ProductSimpleForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Produtos",
            route: "/product",
          },
          {
            title: "Simples",
            route: "/simple",
          },
        ],
      },
      {
        path: "/product/combo/:idProduct",
        hide: true,
        content: <ProductComboForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Produtos",
            route: "/product",
          },
          {
            title: "Combo",
            route: "/combo",
          },
        ],
      },
      {
        path: "/product/complement/:idProduct",
        hide: true,
        content: <ProductComplementForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Produtos",
            route: "/product",
          },
          {
            title: "Complemento",
            route: "/complement",
          },
        ],
      },
      {
        path: "/group/:idGroup",
        hide: true,
        content: <GroupForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Grupos",
            route: "/group",
          },
        ],
      },
      {
        title: "Operadores",
        path: "/operator",
        content: <OperatorList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Operadores",
            route: "/operator",
          },
        ],
      },
      {
        path: "/operator/:idOperator",
        hide: true,
        content: <OperatorForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Operadores",
            route: "/operator",
          },
        ],
      },
      {
        title: "Dispositivos",
        path: "/device",
        content: <DeviceList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Dispositivos",
            route: "/device",
          },
        ],
      },
      {
        path: "/device/:idDevice",
        hide: true,
        content: <DeviceForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Dispositivos",
            route: "/device",
          },
        ],
      },
      {
        title: "Validadores",
        path: "/validator",
        content: <ValidatorList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Validadores",
            route: "/validator",
          },
        ],
      },
      {
        path: "/validator/:idValidator",
        hide: true,
        content: <ValidatorForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Validadores",
            route: "/validator",
          },
        ],
      },
      /*
      {
        title: "Mesas",
        path: "/reservation",
        //content: <ReservationList />,
        content: <EmBreve />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Mesas",
            route: "/reservation",
          },
        ],
      },
      {
        path: "/reservation/:idReservation",
        hide: true,
        content: <ReservationForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Mesas",
            route: "/reservation",
          },
        ],
      },
      {
        title: "Listas",
        path: "/list",
        //content: <ListsList />,
        content: <EmBreve />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Listas",
            route: "/list",
          },
        ],
      },
      {
        path: "/list/:idList",
        hide: true,
        content: <ListsData />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Listas",
            route: "/list",
          },
        ],
      },
      {
        title: "Códigos Garçons",
        path: "/waiter",
        content: <WaiterList />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Códigos Garçons",
            route: "/waiter",
          },
        ],
      },
      {
        path: "/waiter/:idWaiter",
        hide: true,
        content: <WaiterForm />,
        allow: {
          allow_register: 1,
          allow_operation: 0,
        },
        paths: [
          {
            title: "Códigos Garçons",
            route: "/waiter",
          },
        ],
      },
      */
    ],
  },
  {
    title: "Loja Online",
    icon: OnlineIcon,
    allow: {
      allow_only_ecommerce: true,
    },
    list: [
      {
        title: "Visão geral",
        path: "/webstore",
        content: <WSOverview />,
        allow: {
          allow_only_ecommerce: true,
        },
        paths: [
          {
            title: "Loja virtual",
            route: "/webstore",
          },
          {
            title: "Visão geral",
            route: "/overview",
          },
        ],
      },
      {
        title: "Configurações",
        path: "/webstore/settings",
        content: <WSSettings />,
        allow: {
          allow_only_ecommerce: true,
        },
        paths: [
          {
            title: "Loja virtual",
            route: "/webstore",
          },
          {
            title: "Configurações",
            route: "/settings",
          },
        ],
      },
      {
        title: "Ingressos a Venda",
        path: "/webstore/tickets",
        content: <EmBreve />,
        allow: {
          allow_only_ecommerce: true,
        },
        paths: [
          {
            title: "Loja virtual",
            route: "/webstore",
          },
          {
            title: "Ingressos",
            route: "/settings",
          },
        ],
      },
      {
        title: "Extratos de Venda",
        path: "/webstore/statements",
        content: <WSStatement />,
        allow: {
          allow_only_ecommerce: true,
        },
        paths: [
          {
            title: "Loja virtual",
            route: "/webstore",
          },
          {
            title: "Extratos",
            route: "/statements",
          },
        ],
      },
      {
        title: "Retiradas",
        path: "/webstore/withdrawals",
        content: <EmBreve />,
        allow: {
          allow_only_ecommerce: true,
          allow_only_admin: true,
        },
        paths: [
          {
            title: "Loja virtual",
            route: "/webstore",
          },
          {
            title: "Retiradas",
            route: "/withdrawals",
          },
        ],
      },
    ],
    // list: [
    //   {
    //     title: "Eventos",
    //     path: "/online-events",
    //     content: <OnlineEventList />,
    //     allow: {
    //       allow_only_ecommerce: true,
    //     },
    //     paths: [
    //       {
    //         title: "Eventos",
    //         route: "/online-events",
    //       },
    //     ],
    //   },
    //   {
    //     path: "/online-events/:idEvent",
    //     content: <OnlineEventForm />,
    //     allow: {
    //       allow_only_ecommerce: true,
    //     },
    //     paths: [
    //       {
    //         title: "Eventos",
    //         route: "/online-events",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Ingressos",
    //     path: "/online-products",
    //     content: <OnlineProductList />,
    //     allow: {
    //       allow_only_master: true,
    //     },
    //     paths: [
    //       {
    //         title: "Ingressos",
    //         route: "/online-products",
    //       },
    //     ],
    //   },
    //   {
    //     path: "/online-products/:idProduct",
    //     hide: true,
    //     content: <OnlineProductForm />,
    //     allow: {
    //       allow_register: 1,
    //       allow_operation: 0,
    //     },
    //     paths: [
    //       {
    //         title: "Ingressos",
    //         route: "/online-products",
    //       },
    //     ],
    //   },
    // ],
  },
  {
    title: "Gerencial",
    icon: ManagerIcon,
    list: [
      {
        title: "Conciliar dados",
        path: "/reconcile",
        content: <ReconcileData />,
        show: {
          role: "master",
        },
        allow: {
          allow_only_master: true,
        },
        paths: [
          {
            title: "Conciliar Dados",
            route: "/reconcile",
          },
        ],
      },
      {
        title: "Transações",
        path: "/transaction",
        content: <TransactionList />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Transações",
            route: "/transaction",
          },
        ],
      },
      {
        path: "/profile",
        title: "Meu Perfil",
        content: <Profile />,
        paths: [
          {
            title: "Configuração",
            route: "/organization",
          },
          {
            title: "Perfil",
            route: "/profile",
          },
        ],
      },
      /*
      {
        title: "Cancelamentos",
        path: "/transaction/cancellations",
        //content: <TransactionProductsList />,
        content: <EmBreve />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Transações",
            route: "/transaction",
          },
        ],
      },
      {
        title: "Trocar Produtos",
        path: "/transaction/exchange",
        //content: <TransactionExchangeList />,
        content: <EmBreve />,
        show: {
          role: "master",
        },
        allow: {
          allow_only_master: true,
        },
        paths: [
          {
            title: "Transações",
            route: "/transaction",
          },
        ],
      },
      {
        path: "/transaction/:idOrder",
        hide: true,
        content: <TransactionProductList />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Transações",
            route: "/transaction",
          },
        ],
      },
      // {
      //   title: 'Cancelamentos',
      //   path: '/cancel',
      //   content: <CancelList />,
      //   allow: {
      //     allow_register: 0,
      //     allow_operation: 1
      //   },
      //   paths: [
      //     {
      //       title: 'Cancelamentos',
      //       route: '/cancel',
      //     },
      //   ],
      // },
      {
        path: "/cancel/:idOrder",
        hide: true,
        content: <CancelProductList />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Cancelamentos",
            route: "/cancel",
          },
        ],
      },
      // {
      //   title: 'Cancelamento em lote',
      //   path: '/cancelorders',
      //   content: <CancelBatch />,
      //   allow: {
      //     allow_register: 0,
      //     allow_operation: 1,
      //   },
      //   paths: [
      //     {
      //       title: 'Cancelamento em lote',
      //       route: '/cancelorders',
      //     },
      //   ],
      // },
      {
        title: "Consulta cashless",
        path: "/cashless",
        //content: <CashlessList />,
        content: <EmBreve />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Consulta cashless",
            route: "/cashless",
          },
        ],
      },
      {
        title: "Sincronizações",
        path: "/sync",
        //content: <SyncList />,
        content: <EmBreve />,
        allow: {
          allow_register: 0,
          allow_operation: 1,
        },
        paths: [
          {
            title: "Sincronizações",
            route: "/sync",
          },
        ],
      },
      */
      // {
      //   title: 'Ajustes',
      //   path: '/adjustment',
      //   content: <AdjustmentList />,
      //   allow: {
      //     allow_register: 0,
      //     allow_operation: 1
      //   },
      //   paths: [
      //     {
      //       title: 'Ajustes',
      //       route: '/adjustment',
      //     },
      //   ],
      // },
      // {
      //   path: '/adjustment/:id',
      //   hide: true,
      //   content: <AdjustmentEdit />,
      //   allow: {
      //     allow_register: 0,
      //     allow_operation: 1
      //   },
      //   paths: [
      //     {
      //       title: 'Ajustes',
      //       route: '/adjustment',
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "Configurações",
    hide: true,
    allow: {
      allow_register: 0,
      allow_operation: 0,
    },
    icon: OrgsIcon,
    list: [
      /*
      {
        show: {
          role: 'master',
        },
        title: 'Clientes',
        path: '/organization',
        content: <Orgs />,
        allow: {
          allow_only_master: true,
        },
        paths: [
          {
            title: 'Configuração',
            route: '/organization',
          },
          {
            title: 'Clientes',
            route: '/organization',
          },
        ],
      },*/
      {
        path: "/organization/:idOrg",
        hide: true,
        content: <OrgForm />,
        allow: {
          allow_only_master: true,
        },
        paths: [
          {
            title: "Configuração",
            route: "/organization",
          },
          {
            title: "Clientes",
            route: "/organization",
          },
        ],
      },
    ],
  },
]
