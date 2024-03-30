import Modal from "react-bootstrap/Modal";
import React, {useContext, useEffect, useState} from "react";
import {fetchData} from "@/truvoicer-base/library/api/fetcher/middleware";
import ItemViewAccordion from "@/truvoicer-base/components/accordions/ItemViewAccordion";
import {useRouter} from "next/navigation";
import {GameTabConfig} from "@/truvoicer-base/config/tabs/item/game";
import ImageLoader from "@/truvoicer-base/components/loaders/ImageLoader";
import {getItemViewUrl} from "@/truvoicer-base/redux/actions/item-actions";
import {TemplateManager} from "@/truvoicer-base/library/template/TemplateManager";
import {TemplateContext} from "@/truvoicer-base/config/contexts/TemplateContext";

const ComparisonsInfoModal = (props) => {
    const router = useRouter();

    const [data, setData] = useState({})
    const [show, setShow] = useState(false)
    const templateManager = new TemplateManager(useContext(TemplateContext));

    async function initRequest() {
        const url = getItemViewUrl(props.data.item, props.category)
        // router.push(url, url, { shallow: true });

        const response = await fetchData("operation", ["single"], {
            query: props.data.item.item_id,
            provider: props.data.item.provider
        });

        setData(response.data.request_data[0])
        setShow(true)
    }
    useEffect(() => {
        initRequest();
    }, [props.data.item.item_id, props.data.item.provider])


    const getTabConfig = () => {
        let tabConfig = GameTabConfig;
        tabConfig.config.initialTab = 0
        return tabConfig;
    }
    return (
        <Modal show={props.data.show} onHide={props.close} size={"lg"}>
            <Modal.Body>
                {show &&
                <div className={"item-info"}>
                    <div className={"item-info--header"}>
                        <h3 className={"item-info--title"}>{data.item_name}</h3>
                        <div className={"listings-block--item--action"}>
                            <a href={data.item_links}
                               className="button"
                               target={"_blank"}>More info</a>
                        </div>
                    </div>
                    <div className={"item-info--header-image"}>
                        <ImageLoader
                            item={data}
                            imageData={data.item_default_image}
                        />
                    </div>
                    <div className={"item-info--tabs"}>

                            <ItemViewAccordion
                                data={getTabConfig()}
                                item={data}
                            />

                    </div>
                </div>
                }
            </Modal.Body>
        </Modal>
    )
}

export default ComparisonsInfoModal;
