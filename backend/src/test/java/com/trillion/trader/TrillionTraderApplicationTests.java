package com.trillion.trader;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.mongodb.client.MongoClient;
import com.trillion.trader.repository.UserRepository;

@SpringBootTest
class TrillionTraderApplicationTests {

    @MockitoBean
    private MongoClient mongoClient;

    @MockitoBean
    private UserRepository userRepository;

	@Test
	void contextLoads() {
	}

}
