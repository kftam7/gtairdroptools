import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Form, Input, Button, Row, Col, notification, Modal } from 'antd';
import { UndoOutlined } from '@ant-design/icons';

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";
import { toHex, truncateAddress } from "./utils";
import { chainApi, crypto } from "./services/home";

import cryptoAddress from "./utils/crypto_address.json";
import bnbImg from './assets/bnb_logo.png';
import polygonImg from './assets/polygon_logo.png';

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

var captcha = "";

const Walletconnect = (props) => {

  const language = props.language;
  const [form] = Form.useForm();

  let { tokenID } = useParams();
  form.setFieldsValue({ key: tokenID });

  const [web3Provider, setweb3Provider] = useState();
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const [isHandleConfirmInput, setIsHandleConfirmInput] = useState(false);
  const [isChainDiff, setIsChainDiff] = useState(false);
  const [isExpiry, setIsExpiry] = useState("");
  const [isExists, setIsExists] = useState("");
  const [kycValue, setkycValue] = useState("");
  const [getChainFunRun, setGetChainFunRun] = useState(true);
  const [chain, setChain] = useState("");
  const [isCaptchaError, setIsCaptchaError] = useState(true);

  // 验证码随机颜色
  const textColor = () => {
    const red = Math.floor(Math.random()*256);
    const green = Math.floor(Math.random()*256);
    const blue = Math.floor(Math.random()*256);
    return "rgb("+red+","+green+","+blue+")";
  };

  // 生成随机验证码
  const randomCode = () => {
    const myCanvas = document.querySelector("#canvas");
    let ctx = myCanvas.getContext('2d');
    ctx.textBaseline = 'alphabetic';
    captcha = "";
    // 清空验证码
    ctx.clearRect(0,0,100,40);
    if (form.getFieldValue("captcha")) {
      form.setFieldsValue({captcha: ""});
    }
    // 随机验证码
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
                  "k", "l", "s", "t", "u", "v", "w", "x", "y", "z",
                  "A", "B", "C", "D", "F", "G", "H", "I", "J", "K",
                  "L", "S", "T", "U", "V", "W", "X", "Y", "Z"
                ];
    // 显示四位数的验证码
    for (let i = 0; i < 4; i++) {
      const x = 20 + 20 * i;
      const y = 20 + 10 * Math.random();
      // 在数组中获取到随机的索引整数
      const index = Math.floor(Math.random() * arr.length);
      // 通过随机的索引获取到随机的元素
      const texts = arr[index];
      captcha += texts;
      // 设置验证码的相关样式
      ctx.font = "bold 20px 微软雅黑";
      ctx.fillStyle = textColor();
      // 画布旋转显示
      // translate() 方法重新映射画布上的位置
      ctx.translate(x, y);
      // 将画布旋转，旋转角度，以弧度旋转(弧度=degrees*Math.PI/180 )
      var deg = 90 * Math.random() * Math.PI / 360;
      ctx.rotate(deg); //
      ctx.fillText(texts, 0, 0);
      // 将画布映射返回原来的位置
      ctx.rotate(-deg);
      ctx.translate(-x, -y);
    }

    // 制作验证码的干扰线制作
    for(let l=0;l<6;l++){
      ctx.beginPath();
      ctx.moveTo(Math.random()*100,Math.random()*40);
      ctx.lineTo(Math.random()*100,Math.random()*40);
      // 设置干扰线的颜色
      ctx.strokeStyle=textColor();
      ctx.stroke();
    }
    // 制作验证码的干扰圆点
    for(let k=0;k<20;k++){
      ctx.beginPath();
      const x=Math.random()*100;
      const y=Math.random()*100;
      ctx.moveTo(x,y);
      ctx.lineTo(x+1,y+1);
      // 设置干扰线的颜色
      ctx.strokeStyle=textColor();
      ctx.stroke();
    }
  };

  useEffect(() => {
      if (!isHandleConfirmInput && account && !isChainDiff && !isExpiry && !isExists) {
      randomCode();
    }
  });

  const getChain = () => {
    if (getChainFunRun) {
      console.log("getChain");
      setGetChainFunRun(false);
      //console.log(tokenID);
      chainApi(tokenID)
      .then(response => response.json())
      .then(response => {
        if (new Date(response.expiry).getTime() - new Date().getTime() > 0) {
          setIsExpiry(false);
          if (!(response.walletAddress||'').toLowerCase().startsWith("0x")) {
            setIsExists(false);
            //if (response.KYC == 0) {
              setkycValue(response.KYC);
              setChain(response.chain);
              console.log("response.chain: ", response.chain);
              form.setFieldsValue({ chain: response.chain });
              if (response.chain.toLowerCase() === "bsc") {
                setImgUrl(bnbImg);
              } else if (response.chain.toLowerCase() === "polygon") {
                setImgUrl(polygonImg);

              } else {
                setImgUrl("");
              }
              notification["success"]({
                message: language["notification.success.message"],
                description: language["home.chain.api.success.pass"]
              });
            /*  
            } else {
              setkycValue(response.KYC);
              setEmailAddress(response.emailAddress);
              if (response.chain.toLowerCase() === "bsc") {
                setClientId("green_token_db33f");
              } else if(response.chain.toLowerCase() === "polygon") {
                setClientId("green_token_matic");
              } else {
                setClientId("");
              }
            }
            */
          }else{
            setIsExists(true);
          }
        } else {
          setIsExpiry(true);
        }
      })
      .catch(err => {
        console.log(err);
        notification["error"]({
          message: language["home.chain.api.error"],
          description: err.toString(),
        });
      })
    }
  };

  useEffect(() => {
    getChain();
  });

  const connectWallet = async () => {
      try {
        const web3Provider = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(web3Provider);
        const accounts = await provider.listAccounts();
        const network = await provider.getNetwork();
        setweb3Provider(web3Provider);
        setProvider(provider);

        const chainIdKey = `${chain.toLowerCase()}_chain_id`;
        const chainIdValue = cryptoAddress[chainIdKey];

        console.log("chain: ", chain);
        console.log("chainIdKey: ", chainIdKey);
        console.log("chainIdValue: ", chainIdValue);
        console.log("network: ", network.chainId);

        if (network.chainId == chainIdValue) {
          setIsChainDiff(false);
        } else {
          setIsChainDiff(true);
        }

        if (accounts){
          form.setFieldsValue({walletAddress: accounts[0]});
          setAccount(accounts[0]);
        } 
        setChainId(network.chainId);

      } catch (error) {
        setError(error);
      }
  };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

/*
  useEffect(() => {
    if (web3Modal.cachedProvider) {
    //if (true) {
      connectWallet();
    }
  }, []);
*/

  useEffect(() => {  
    if (web3Provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        window.location.reload();
      };

      const handleChainChanged = (_hexChainId) => {
        console.log("ChainId Changed: ", _hexChainId);
        window.location.reload();        
      };

      const handleDisconnect = () => {
        disconnect();
      };

      web3Provider.on("accountsChanged", handleAccountsChanged);
      web3Provider.on("chainChanged", handleChainChanged);
      web3Provider.on("disconnect", handleDisconnect);

      return () => {
        if (web3Provider.removeListener) {
          web3Provider.removeListener("accountsChanged", handleAccountsChanged);
          web3Provider.removeListener("chainChanged", handleChainChanged);
          web3Provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  const updateWallet = () => {
    const params = {
      tokenID,
      account
    };
    crypto(params)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      notification["success"]({
        message: language["notification.success.message"],
        description: language["home.crypto.api.success.pass"]
      });
    })
    .catch(err => {
      console.log(err);
      notification["error"]({
        message: language["home.crypto.api.error"],
        description: err.toString(),
      });
    });
  }

  const confirm = () => {
    Modal.confirm({
      title: language["home.Modal.title"],
      icon: "",
      content: account,
      okText: language["home.Modal.okText"],
      cancelText: language["home.Modal.cancelText"],
      onOk: updateWallet,
    });
  };

  // 校验 验证码
  const handleConfirmInput = (rule, value, callback) => {
    setIsHandleConfirmInput(true);
    if (value.toLowerCase() === captcha.toLowerCase()) {
      setIsCaptchaError(false);
      return Promise.resolve();
    } else {
      setIsCaptchaError(true);
      return Promise.reject(language["home.captcha.fail"]);
    }
  };

  return (
    <>
      {
        isExpiry === true ?
        <Form
          style={{ padding: 20 }}
          form={form}
          name="expiry"
        >
          <div>{language["home.expiry.info"]}</div>
        </Form>
        :
        isExists === true ?
        <Form
          style={{ padding: 20 }}
          form={form}
          name="exists"
        >
          <div>{language["home.exists.info"]}</div>
        </Form>
        :
        <Form
          style={{ padding: 20 }}
          form={form}
          name="basic"
          layout="vertical"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            key: '',
            chain: '',
            walletAddress: '',
          }}
        >
          <div style={{ marginBottom: 20 }}>{language["home.title"]}</div>
          <Row>
            <Col span={6}>
              <Form.Item
                label={language["home.form.label.Key"]}
                name="key"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row align="middle">
            <Col span={6}>
              <Form.Item
                label={language["home.form.label.Chain"]}
                name="chain"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            {
              imgUrl !== "" ? 
              <Col span={2}>
                <img src={imgUrl} alt="" className="chain-img"></img>
              </Col>
              : ""
            }
          </Row>
          {
            account ?
            <Row>
              <Col span={6}>
                <Form.Item
                  label={language["home.form.label.walletAddress"]}
                  name="walletAddress"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            : ""
          }
          {!account && (
            <Button type="primary" onClick={connectWallet}>
              {language["home.button.connectWallet"]}
            </Button>
          )}
          {
            isChainDiff ?
            <Row>
              <Col span={24}>{language["home.Col.wrongChain"]}</Col>
              <Col span={24}>{language["home.Col.pleaseLogin"]}<span style={{ color: "red" }}>{chain}</span>{language["home.Col.chainAndRefreshPage"]}</Col>
            </Row>
            : ""
          }
          {
            account && !isChainDiff ?
            <>
              <Row align="middle" style={{ marginBottom: 10, marginTop: 10 }}>
                <Col>
                  <canvas
                    id="canvas"
                    width="100"
                    height="38"
                    style={{border: '1px solid #005453', display: 'block',}}
                  >
                  </canvas>
                </Col>
                <Col style={{ marginLeft: 10 }}>
                  <Button type="primary" icon={<UndoOutlined />} style={{height: 40, width: 40}} onClick={randomCode}></Button>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                <Form.Item
                  name="captcha"
                  rules={[
                    { required: true, message: language["home.form.Item.required.message.captcha"] },
                    {
                      validator: handleConfirmInput
                    }
                  ]}
                >
                  <Input maxLength={4} placeholder={language["home.input.placeholder.enterCaptcha"]} />
                </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={2}>
                  <Button type="primary" onClick={confirm} disabled={isCaptchaError ? true : false}>{language["home.button.Send"]}</Button>
                </Col>
                <Col span={2}>
                  <Button type="primary" onClick={disconnect}>Disconnect</Button>
                </Col>
              </Row>
            </>
            : ""
          }
        </Form>
      }
    </>
  );
}

export default Walletconnect;